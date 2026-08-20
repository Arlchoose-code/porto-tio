package models

import (
	"time"
)

type SeoSetting struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Path            string    `gorm:"size:191;uniqueIndex;not null" json:"path"`
	MetaTitle       string    `gorm:"size:255" json:"meta_title"`
	MetaDescription string    `gorm:"type:text" json:"meta_description"`
	OgTitle         string    `gorm:"size:255" json:"og_title"`
	OgDescription   string    `gorm:"type:text" json:"og_description"`
	OgImage         string    `gorm:"size:255" json:"og_image"`
	CanonicalUrl    string    `gorm:"size:255" json:"canonical_url"`
	JsonLd          string    `gorm:"type:text" json:"json_ld"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
