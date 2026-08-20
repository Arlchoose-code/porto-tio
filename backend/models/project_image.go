package models

import (
	"time"
)

type ProjectImage struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	ProjectID    uint      `gorm:"index;not null" json:"project_id"`
	ThumbnailUrl string    `gorm:"size:255" json:"thumbnail_url"`
	MediumUrl    string    `gorm:"size:255" json:"medium_url"`
	OriginalUrl  string    `gorm:"size:255;not null" json:"original_url"`
	Caption      string    `gorm:"size:255" json:"caption"`
	Order        int       `gorm:"default:0" json:"order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
