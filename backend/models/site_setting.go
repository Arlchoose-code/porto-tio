package models

import (
	"time"
)

type SiteSetting struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `gorm:"size:255;not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Logo        string    `gorm:"size:255" json:"logo"`
	Favicon     string    `gorm:"size:255" json:"favicon"`
	Address         string    `gorm:"size:255" json:"address"`
	Email           string    `gorm:"size:255" json:"email"`
	Phone           string    `gorm:"size:255" json:"phone"`
	BioShort        string    `gorm:"type:text" json:"bio_short"`
	FooterText      string    `gorm:"type:text" json:"footer_text"`
	RobotsTxt       string    `gorm:"type:text" json:"robots_txt"`
	HeroBadge       string    `gorm:"size:255" json:"hero_badge"`
	HeroTitle       string    `gorm:"size:255" json:"hero_title"`
	HeroDescription string    `gorm:"type:text" json:"hero_description"`
	HeroStats       string    `gorm:"type:text" json:"hero_stats"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}