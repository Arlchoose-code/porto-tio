package models

import (
	"time"
)

type Certificate struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	Name           string     `gorm:"size:255;not null" json:"name"`
	Issuer         string     `gorm:"size:255;not null" json:"issuer"`
	IssueDate      time.Time  `json:"issue_date"`
	ExpirationDate *time.Time `json:"expiration_date"`
	CredentialID   string     `gorm:"size:255" json:"credential_id"`
	CredentialURL  string     `gorm:"size:255" json:"credential_url"`
	ThumbnailUrl   string     `gorm:"size:255" json:"thumbnail_url"`
	MediumUrl      string     `gorm:"size:255" json:"medium_url"`
	OriginalUrl    string     `gorm:"size:255" json:"original_url"`
	Description    string     `gorm:"type:text" json:"description"`
	Order          int        `gorm:"default:0" json:"order"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
}
