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
	HeroImage        string    `gorm:"size:255" json:"hero_image"`
	HeroCardTitle    string    `gorm:"size:255" json:"hero_card_title"`
	HeroCardStatus   string    `gorm:"size:255" json:"hero_card_status"`
	HeroCardSubtitle string    `gorm:"size:255" json:"hero_card_subtitle"`
	HeroStats        string    `gorm:"type:text" json:"hero_stats"`
	CareerBadge      string    `gorm:"size:255" json:"career_badge"`
	CareerTitle      string    `gorm:"size:255" json:"career_title"`
	CareerDescription string   `gorm:"type:text" json:"career_description"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}