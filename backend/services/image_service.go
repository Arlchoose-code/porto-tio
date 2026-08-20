package services

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"portfolio-backend/config"
	"portfolio-backend/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UploadedMediaResult struct {
	Media        *models.Media
	ThumbnailUrl string
	MediumUrl    string
	OriginalUrl  string
}

func ProcessAndSaveImage(db *gorm.DB, fileHeader *multipart.FileHeader) (*UploadedMediaResult, error) {
	if err := ValidateUploadedFile(fileHeader); err != nil {
		return nil, err
	}

	srcFile, err := fileHeader.Open()
	if err != nil {
		return nil, err
	}
	defer srcFile.Close()

	img, err := DecodeImage(srcFile)
	if err != nil {
		return nil, fmt.Errorf("failed to decode image: %v", err)
	}

	cfg := config.AppConfig
	storageBase := cfg.StoragePath
	origDir := filepath.Join(storageBase, "originals")
	medDir := filepath.Join(storageBase, "medium")
	thumbDir := filepath.Join(storageBase, "thumbnails")

	_ = os.MkdirAll(origDir, 0755)
	_ = os.MkdirAll(medDir, 0755)
	_ = os.MkdirAll(thumbDir, 0755)

	uid := uuid.New().String()
	baseName := strings.TrimSuffix(filepath.Base(fileHeader.Filename), filepath.Ext(fileHeader.Filename))
	cleanBaseName := Slugify(baseName)
	fileName := fmt.Sprintf("%s_%s.jpg", cleanBaseName, uid[:8])

	origPath := filepath.Join(origDir, fileName)
	medPath := filepath.Join(medDir, fileName)
	thumbPath := filepath.Join(thumbDir, fileName)

	// Save 3 sizes
	if err := ResizeAndSaveImage(img, 1920, origPath, 90); err != nil {
		return nil, fmt.Errorf("failed to save original image: %v", err)
	}
	if err := ResizeAndSaveImage(img, 900, medPath, 85); err != nil {
		return nil, fmt.Errorf("failed to save medium image: %v", err)
	}
	if err := ResizeAndSaveImage(img, 400, thumbPath, 80); err != nil {
		return nil, fmt.Errorf("failed to save thumbnail image: %v", err)
	}

	origUrl := fmt.Sprintf("/storage/media/originals/%s", fileName)
	medUrl := fmt.Sprintf("/storage/media/medium/%s", fileName)
	thumbUrl := fmt.Sprintf("/storage/media/thumbnails/%s", fileName)

	media := models.Media{
		Filename:     fileName,
		OriginalName: fileHeader.Filename,
		FileSize:     fileHeader.Size,
		MimeType:     "image/jpeg",
		ThumbnailUrl: thumbUrl,
		MediumUrl:    medUrl,
		OriginalUrl:  origUrl,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := db.Create(&media).Error; err != nil {
		return nil, err
	}

	return &UploadedMediaResult{
		Media:        &media,
		ThumbnailUrl: thumbUrl,
		MediumUrl:    medUrl,
		OriginalUrl:  origUrl,
	}, nil
}
