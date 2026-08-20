package models

import (
	"time"
)

type Page struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Title           string    `gorm:"size:255;not null" json:"title"`
	Slug            string    `gorm:"size:191;uniqueIndex;not null" json:"slug"`
	Content         string    `gorm:"type:longtext" json:"content"`
	Status          string    `gorm:"size:50;default:'published'" json:"status"` // published, draft
	MetaTitle       string    `gorm:"size:255" json:"meta_title"`
	MetaDescription string    `gorm:"type:text" json:"meta_description"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
