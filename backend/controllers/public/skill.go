package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListSkills(c *gin.Context) {
	var categories []models.SkillCategory
	config.DB.Preload("Skills", func(db *gorm.DB) *gorm.DB {
		return db.Order("`order` asc, proficiency desc")
	}).Order("`order` asc, id asc").Find(&categories)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skills retrieved",
		Data:    categories,
	})
}
