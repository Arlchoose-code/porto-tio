package models

import (
	"time"
)

type Publication struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Title           string    `gorm:"size:255;not null" json:"title"`
	Journal         string    `gorm:"size:255;not null" json:"journal"`
	IndexType       string    `gorm:"size:100" json:"index_type"` // e.g. SINTA 4, Scopus
	PublicationDate time.Time `json:"publication_date"`
	DOI             string    `gorm:"size:255" json:"doi"`
	Url             string    `gorm:"size:255" json:"url"`
	Abstract        string    `gorm:"type:text" json:"abstract"`
	Authors         string    `gorm:"size:255" json:"authors"`
	Order           int       `gorm:"default:0" json:"order"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
