package services

import (
	"encoding/json"
	"log"

	"portfolio-backend/models"

	"gorm.io/gorm"
)

func TriggerRevalidation(db *gorm.DB, domain string, paths []string) {
	if len(paths) == 0 {
		return
	}

	pathsJSON, err := json.Marshal(paths)
	if err != nil {
		log.Printf("Failed to marshal revalidation paths: %v", err)
		return
	}

	job := models.RevalidationJob{
		Domain:      domain,
		Paths:       string(pathsJSON),
		Status:      "pending",
		Attempts:    0,
		MaxAttempts: 3,
	}

	if err := db.Create(&job).Error; err != nil {
		log.Printf("Failed to queue revalidation job: %v", err)
	} else {
		log.Printf("Revalidation job queued for domain [%s] with paths: %s", domain, string(pathsJSON))
	}
}
