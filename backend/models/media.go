package models

import (
	"time"
)

type Media struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Filename     string    `gorm:"size:255;not null" json:"filename"`
	OriginalName string    `gorm:"size:255;not null" json:"original_name"`
	FileSize     int64     `json:"file_size"`
	MimeType     string    `gorm:"size:100" json:"mime_type"`
	ThumbnailUrl string    `gorm:"size:255" json:"thumbnail_url"`
	MediumUrl    string    `gorm:"size:255" json:"medium_url"`
	OriginalUrl  string    `gorm:"size:255;not null" json:"original_url"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
