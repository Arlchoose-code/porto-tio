package models

import (
	"time"
)

type SkillCategory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"size:100;not null" json:"name"`
	Slug      string    `gorm:"size:191;uniqueIndex;not null" json:"slug"`
	Order     int       `gorm:"default:0" json:"order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Skills    []Skill   `gorm:"foreignKey:CategoryID" json:"skills,omitempty"`
}
