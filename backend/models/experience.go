package models

import (
	"time"
)

type Experience struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	Company        string     `gorm:"size:255;not null" json:"company"`
	Position       string     `gorm:"size:255;not null" json:"position"`
	Location       string     `gorm:"size:255" json:"location"`
	EmploymentType string     `gorm:"size:100" json:"employment_type"` // Full-time, Part-time, Internship, Organizational
	StartDate      time.Time  `json:"start_date"`
	EndDate        *time.Time `json:"end_date"`
	IsCurrent      bool       `gorm:"default:false" json:"is_current"`
	Description    string     `gorm:"type:text" json:"description"`
	Order          int        `gorm:"default:0" json:"order"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}
