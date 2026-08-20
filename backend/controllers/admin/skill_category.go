package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListSkillCategories(c *gin.Context) {
	var list []models.SkillCategory
	config.DB.Preload("Skills", func(db *gorm.DB) *gorm.DB {
		return db.Order("`order` asc, id asc")
	}).Order("`order` asc, id asc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill categories retrieved",
		Data:    list,
	})
}

func CreateSkillCategory(c *gin.Context) {
	var req structs.SkillCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	slug := req.Slug
	if slug == "" {
		slug = services.GenerateUniqueSlug(config.DB, "skill_categories", req.Name, 0)
	}

	cat := models.SkillCategory{
		Name:  req.Name,
		Slug:  slug,
		Order: req.Order,
	}

	if err := config.DB.Create(&cat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create skill category",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "skill", []string{"/skills"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill category created successfully",
		Data:    cat,
	})
}

func UpdateSkillCategory(c *gin.Context) {
	id := c.Param("id")
	var cat models.SkillCategory
	if err := config.DB.First(&cat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Skill category not found",
			Data:    nil,
		})
		return
	}

	var req structs.SkillCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	slug := cat.Slug
	if req.Slug != "" && req.Slug != cat.Slug {
		slug = services.GenerateUniqueSlug(config.DB, "skill_categories", req.Slug, cat.ID)
	}

	cat.Name = req.Name
	cat.Slug = slug
	cat.Order = req.Order

	config.DB.Save(&cat)
	services.TriggerRevalidation(config.DB, "skill", []string{"/skills"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill category updated successfully",
		Data:    cat,
	})
}

func DeleteSkillCategory(c *gin.Context) {
	id := c.Param("id")
	var cat models.SkillCategory
	if err := config.DB.First(&cat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Skill category not found",
			Data:    nil,
		})
		return
	}

	// Delete associated skills
	config.DB.Where("category_id = ?", cat.ID).Delete(&models.Skill{})
	config.DB.Delete(&cat)
	services.TriggerRevalidation(config.DB, "skill", []string{"/skills"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill category deleted successfully",
		Data:    nil,
	})
}
