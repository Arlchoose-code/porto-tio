package models

import (
	"time"
)

type RevalidationJob struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Domain      string    `gorm:"size:100;not null" json:"domain"`
	Paths       string    `gorm:"type:text;not null" json:"paths"` // JSON array string
	Status      string    `gorm:"size:50;default:'pending'" json:"status"` // pending, processing, done, failed
	Attempts    int       `gorm:"default:0" json:"attempts"`
	MaxAttempts int       `gorm:"default:3" json:"max_attempts"`
	Error       string    `gorm:"type:text" json:"error"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
