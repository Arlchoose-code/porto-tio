package database

import (
	"log"
	"portfolio-backend/models"

	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) {
	err := db.AutoMigrate(
		&models.User{},
		&models.Session{},
		&models.PersonalAccessToken{},
		&models.SiteSetting{},
		&models.SeoSetting{},
		&models.SocialLink{},
		&models.ProjectCategory{},
		&models.Project{},
		&models.ProjectImage{},
		&models.Certificate{},
		&models.Experience{},
		&models.Education{},
		&models.SkillCategory{},
		&models.Skill{},
		&models.Publication{},
		&models.Media{},
		&models.Page{},
		&models.RevalidationJob{},
	)
	if err != nil {
		log.Fatalf("Auto migration failed: %v", err)
	}
	log.Println("Database migration completed successfully.")
}
