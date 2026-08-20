package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListSkills(c *gin.Context) {
	var skills []models.Skill
	config.DB.Preload("Category").Order("`order` asc, id asc").Find(&skills)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skills retrieved",
		Data:    skills,
	})
}

func CreateSkill(c *gin.Context) {
	var req structs.SkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	skill := models.Skill{
		CategoryID:  req.CategoryID,
		Name:        req.Name,
		Proficiency: req.Proficiency,
		Icon:        req.Icon,
		Order:       req.Order,
	}

	if err := config.DB.Create(&skill).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create skill",
			Data:    nil,
		})
		return
	}

	config.DB.Preload("Category").First(&skill, skill.ID)
	services.TriggerRevalidation(config.DB, "skill", []string{"/skills"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill created successfully",
		Data:    skill,
	})
}

func UpdateSkill(c *gin.Context) {
	id := c.Param("id")
	var skill models.Skill
	if err := config.DB.First(&skill, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Skill not found",
			Data:    nil,
		})
		return
	}

	var req structs.SkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	skill.CategoryID = req.CategoryID
	skill.Name = req.Name
	skill.Proficiency = req.Proficiency
	skill.Icon = req.Icon
	skill.Order = req.Order

	config.DB.Save(&skill)
	config.DB.Preload("Category").First(&skill, skill.ID)

	services.TriggerRevalidation(config.DB, "skill", []string{"/skills"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill updated successfully",
		Data:    skill,
	})
}

func DeleteSkill(c *gin.Context) {
	id := c.Param("id")
	var skill models.Skill
	if err := config.DB.First(&skill, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Skill not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&skill)
	services.TriggerRevalidation(config.DB, "skill", []string{"/skills"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Skill deleted successfully",
		Data:    nil,
	})
}
