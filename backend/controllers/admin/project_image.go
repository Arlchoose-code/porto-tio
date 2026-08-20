package admin

import (
	"net/http"
	"strconv"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func UploadProjectImage(c *gin.Context) {
	projectIDStr := c.Param("id")
	projectID, err := strconv.ParseUint(projectIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid project ID",
			Data:    nil,
		})
		return
	}

	var project models.Project
	if err := config.DB.First(&project, projectID).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Project not found",
			Data:    nil,
		})
		return
	}

	fileHeader, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Image file is required",
			Data:    nil,
		})
		return
	}

	result, err := services.ProcessAndSaveImage(config.DB, fileHeader)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Failed to process image: " + err.Error(),
			Data:    nil,
		})
		return
	}

	caption := c.PostForm("caption")
	orderStr := c.PostForm("order")
	order := 0
	if orderStr != "" {
		order, _ = strconv.Atoi(orderStr)
	}

	img := models.ProjectImage{
		ProjectID:    uint(projectID),
		ThumbnailUrl: result.ThumbnailUrl,
		MediumUrl:    result.MediumUrl,
		OriginalUrl:  result.OriginalUrl,
		Caption:      caption,
		Order:        order,
	}

	if err := config.DB.Create(&img).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to save project image",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "project", []string{"/projects/" + project.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project image uploaded successfully",
		Data:    img,
	})
}

func DeleteProjectImage(c *gin.Context) {
	imageID := c.Param("imageId")
	var img models.ProjectImage
	if err := config.DB.First(&img, imageID).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Image not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&img)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project image deleted successfully",
		Data:    nil,
	})
}

func ReorderProjectImages(c *gin.Context) {
	var req structs.ProjectImageReorderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	for idx, imgID := range req.ImageIDs {
		config.DB.Model(&models.ProjectImage{}).Where("id = ?", imgID).Update("order", idx+1)
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project images reordered successfully",
		Data:    nil,
	})
}
