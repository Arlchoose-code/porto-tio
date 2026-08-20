package admin

import (
	"math"
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListMedia(c *gin.Context) {
	var query structs.PaginationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		query.Page = 1
		query.PerPage = 20
	}
	if query.Page < 1 {
		query.Page = 1
	}
	if query.PerPage < 1 || query.PerPage > 100 {
		query.PerPage = 20
	}

	db := config.DB.Model(&models.Media{})
	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("original_name LIKE ? OR filename LIKE ?", s, s)
	}

	var total int64
	db.Count(&total)

	var list []models.Media
	offset := (query.Page - 1) * query.PerPage
	db.Order("id desc").Limit(query.PerPage).Offset(offset).Find(&list)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Media items retrieved",
		Data:    list,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func UploadMedia(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "File is required",
			Data:    nil,
		})
		return
	}

	res, err := services.ProcessAndSaveImage(config.DB, fileHeader)
	if err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Upload failed: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "File uploaded and processed successfully",
		Data:    res.Media,
	})
}

func DeleteMedia(c *gin.Context) {
	id := c.Param("id")
	var media models.Media
	if err := config.DB.First(&media, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Media item not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&media)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Media item deleted successfully",
		Data:    nil,
	})
}
