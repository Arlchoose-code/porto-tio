package workers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"portfolio-backend/config"
	"portfolio-backend/models"

	"gorm.io/gorm"
)

type RevalidationWorker struct {
	DB         *gorm.DB
	Config     *config.Config
	HTTPClient *http.Client
}

func NewRevalidationWorker(db *gorm.DB, cfg *config.Config) *RevalidationWorker {
	return &RevalidationWorker{
		DB:     db,
		Config: cfg,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (w *RevalidationWorker) Start(ctx context.Context) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	log.Println("Revalidation worker started. Polling every 2s...")

	for {
		select {
		case <-ctx.Done():
			log.Println("Revalidation worker stopped.")
			return
		case <-ticker.C:
			w.processPendingJobs()
		}
	}
}

func (w *RevalidationWorker) processPendingJobs() {
	var jobs []models.RevalidationJob
	err := w.DB.Where("status IN ? AND attempts < max_attempts", []string{"pending", "failed"}).
		Order("id asc").
		Limit(10).
		Find(&jobs).Error

	if err != nil || len(jobs) == 0 {
		return
	}

	for _, job := range jobs {
		w.processSingleJob(&job)
	}
}

func (w *RevalidationWorker) processSingleJob(job *models.RevalidationJob) {
	job.Status = "processing"
	w.DB.Save(job)

	var paths []string
	if err := json.Unmarshal([]byte(job.Paths), &paths); err != nil {
		job.Status = "failed"
		job.Error = fmt.Sprintf("Failed to parse paths JSON: %v", err)
		job.Attempts++
		w.DB.Save(job)
		return
	}

	reqPayload, _ := json.Marshal(map[string]interface{}{
		"paths":  paths,
		"secret": w.Config.NextJSRevalidateSecret,
	})

	targetURL := fmt.Sprintf("%s/api/revalidate", w.Config.NextJSURL)
	req, err := http.NewRequest("POST", targetURL, bytes.NewBuffer(reqPayload))
	if err != nil {
		w.recordJobFailure(job, err.Error())
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-revalidate-secret", w.Config.NextJSRevalidateSecret)

	resp, err := w.HTTPClient.Do(req)
	if err != nil {
		w.recordJobFailure(job, fmt.Sprintf("HTTP request error: %v", err))
		return
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		job.Status = "done"
		job.Error = ""
		w.DB.Save(job)
		log.Printf("Revalidation SUCCESS for job #%d (%s): %s", job.ID, job.Domain, job.Paths)
	} else {
		w.recordJobFailure(job, fmt.Sprintf("Next.js returned status %d: %s", resp.StatusCode, string(bodyBytes)))
	}
}

func (w *RevalidationWorker) recordJobFailure(job *models.RevalidationJob, errMsg string) {
	job.Attempts++
	if job.Attempts >= job.MaxAttempts {
		job.Status = "failed"
	} else {
		job.Status = "failed" // will be retried next tick
	}
	job.Error = errMsg
	w.DB.Save(job)
	log.Printf("Revalidation FAIL (attempt %d/%d) for job #%d: %s", job.Attempts, job.MaxAttempts, job.ID, errMsg)
}
