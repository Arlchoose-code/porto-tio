package models

import (
	"time"
)

type Skill struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CategoryID  uint           `gorm:"index" json:"category_id"`
	Category    *SkillCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Name        string         `gorm:"size:100;not null" json:"name"`
	Proficiency int            `gorm:"default:80" json:"proficiency"` // 1-100
	Icon        string         `gorm:"size:100" json:"icon"`
	Order       int            `gorm:"default:0" json:"order"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
}
