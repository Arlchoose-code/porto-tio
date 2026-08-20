package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListSeoSettings(c *gin.Context) {
	var list []models.SeoSetting
	config.DB.Order("path asc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "SEO settings retrieved",
		Data:    list,
	})
}

func CreateSeoSetting(c *gin.Context) {
	var req structs.SeoSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	seo := models.SeoSetting{
		Path:            req.Path,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
		OgTitle:         req.OgTitle,
		OgDescription:   req.OgDescription,
		OgImage:         req.OgImage,
		CanonicalUrl:    req.CanonicalUrl,
		JsonLd:          req.JsonLd,
	}

	if err := config.DB.Create(&seo).Error; err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Failed to create SEO setting: " + err.Error(),
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "seo_setting", []string{req.Path})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "SEO setting created successfully",
		Data:    seo,
	})
}

func UpdateSeoSetting(c *gin.Context) {
	id := c.Param("id")
	var seo models.SeoSetting
	if err := config.DB.First(&seo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "SEO setting not found",
			Data:    nil,
		})
		return
	}

	var req structs.SeoSettingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	seo.Path = req.Path
	seo.MetaTitle = req.MetaTitle
	seo.MetaDescription = req.MetaDescription
	seo.OgTitle = req.OgTitle
	seo.OgDescription = req.OgDescription
	seo.OgImage = req.OgImage
	seo.CanonicalUrl = req.CanonicalUrl
	seo.JsonLd = req.JsonLd

	config.DB.Save(&seo)
	services.TriggerRevalidation(config.DB, "seo_setting", []string{seo.Path})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "SEO setting updated successfully",
		Data:    seo,
	})
}

func DeleteSeoSetting(c *gin.Context) {
	id := c.Param("id")
	var seo models.SeoSetting
	if err := config.DB.First(&seo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "SEO setting not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&seo)
	services.TriggerRevalidation(config.DB, "seo_setting", []string{seo.Path})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "SEO setting deleted successfully",
		Data:    nil,
	})
}
