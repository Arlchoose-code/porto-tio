package models

import (
	"time"
)

type Education struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Institution string    `gorm:"size:255;not null" json:"institution"`
	Degree      string    `gorm:"size:255" json:"degree"`
	Major       string    `gorm:"size:255" json:"major"`
	GPA         string    `gorm:"size:50" json:"gpa"`
	StartYear   int       `json:"start_year"`
	EndYear     int       `json:"end_year"`
	Description string    `gorm:"type:text" json:"description"`
	Order       int       `gorm:"default:0" json:"order"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
