package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func GetSiteSetting(c *gin.Context) {
	var setting models.SiteSetting
	if err := config.DB.First(&setting).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Site settings not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Site settings retrieved",
		Data:    setting,
	})
}

func UpdateSiteSetting(c *gin.Context) {
	var req structs.SiteSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	var setting models.SiteSetting
	if err := config.DB.First(&setting).Error; err != nil {
		setting = models.SiteSetting{}
	}

	setting.Title = req.Title
	setting.Description = req.Description
	setting.Logo = req.Logo
	setting.Favicon = req.Favicon
	setting.Address = req.Address
	setting.Email = req.Email
	setting.Phone = req.Phone
	setting.BioShort = req.BioShort
	setting.FooterText = req.FooterText
	setting.RobotsTxt = req.RobotsTxt

	config.DB.Save(&setting)
	services.TriggerRevalidation(config.DB, "site_setting", []string{"/"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Site settings updated successfully",
		Data:    setting,
	})
}