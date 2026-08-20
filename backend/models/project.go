package models

import (
	"time"
)

type Project struct {
	ID           uint            `gorm:"primaryKey" json:"id"`
	CategoryID   uint            `gorm:"index" json:"category_id"`
	Category     *ProjectCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Title        string          `gorm:"size:255;not null" json:"title"`
	Slug         string          `gorm:"size:191;uniqueIndex;not null" json:"slug"`
	Subtitle     string          `gorm:"size:255" json:"subtitle"`
	Description  string          `gorm:"type:text" json:"description"`
	Content      string          `gorm:"type:longtext" json:"content"`
	ThumbnailUrl string          `gorm:"size:255" json:"thumbnail_url"`
	MediumUrl    string          `gorm:"size:255" json:"medium_url"`
	OriginalUrl  string          `gorm:"size:255" json:"original_url"`
	DemoUrl      string          `gorm:"size:255" json:"demo_url"`
	RepoUrl      string          `gorm:"size:255" json:"repo_url"`
	Status       string          `gorm:"size:50;default:'published'" json:"status"` // published, draft, archived
	Featured     bool            `gorm:"default:false" json:"featured"`
	Order        int             `gorm:"default:0" json:"order"`
	Views        int             `gorm:"default:0" json:"views"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
	Images       []ProjectImage  `gorm:"foreignKey:ProjectID" json:"images,omitempty"`
}
