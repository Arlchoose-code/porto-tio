package models

import (
	"time"
)

type SocialLink struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Platform  string    `gorm:"size:100;not null" json:"platform"`
	Url       string    `gorm:"size:255;not null" json:"url"`
	Icon      string    `gorm:"size:100" json:"icon"`
	Order     int       `gorm:"default:0" json:"order"`
	IsActive  bool      `gorm:"default:true" json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
