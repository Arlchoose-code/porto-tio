package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListSocialLinks(c *gin.Context) {
	var list []models.SocialLink
	config.DB.Order("`order` asc, id asc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Social links retrieved",
		Data:    list,
	})
}

func CreateSocialLink(c *gin.Context) {
	var req structs.SocialLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	soc := models.SocialLink{
		Platform: req.Platform,
		Url:      req.Url,
		Icon:     req.Icon,
		Order:    req.Order,
		IsActive: req.IsActive,
	}

	if err := config.DB.Create(&soc).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create social link",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "social_link", []string{"/"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Social link created successfully",
		Data:    soc,
	})
}

func UpdateSocialLink(c *gin.Context) {
	id := c.Param("id")
	var soc models.SocialLink
	if err := config.DB.First(&soc, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Social link not found",
			Data:    nil,
		})
		return
	}

	var req structs.SocialLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	soc.Platform = req.Platform
	soc.Url = req.Url
	soc.Icon = req.Icon
	soc.Order = req.Order
	soc.IsActive = req.IsActive

	config.DB.Save(&soc)
	services.TriggerRevalidation(config.DB, "social_link", []string{"/"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Social link updated successfully",
		Data:    soc,
	})
}

func DeleteSocialLink(c *gin.Context) {
	id := c.Param("id")
	var soc models.SocialLink
	if err := config.DB.First(&soc, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Social link not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&soc)
	services.TriggerRevalidation(config.DB, "social_link", []string{"/"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Social link deleted successfully",
		Data:    nil,
	})
}
