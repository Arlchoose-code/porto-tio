package services

import (
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"strings"
)

var allowedMimes = map[string]bool{
	"image/jpeg":    true,
	"image/jpg":     true,
	"image/png":     true,
	"image/webp":    true,
	"image/gif":     true,
	"image/svg+xml": true,
}

func ValidateUploadedFile(fileHeader *multipart.FileHeader) error {
	// 1. Max size: 10MB
	if fileHeader.Size > 10*1024*1024 {
		return errors.New("file size exceeds maximum limit of 10MB")
	}

	file, err := fileHeader.Open()
	if err != nil {
		return err
	}
	defer file.Close()

	// 2. Read magic bytes (first 512 bytes)
	buffer := make([]byte, 512)
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF {
		return err
	}

	contentType := http.DetectContentType(buffer[:n])
	// Handle svg special case
	if strings.Contains(strings.ToLower(fileHeader.Filename), ".svg") && strings.Contains(string(buffer[:n]), "<svg") {
		contentType = "image/svg+xml"
	}

	if !allowedMimes[contentType] {
		return errors.New("unsupported file type: " + contentType)
	}

	return nil
}
