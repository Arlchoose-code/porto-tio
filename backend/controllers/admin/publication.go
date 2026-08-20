package admin

import (
	"math"
	"net/http"
	"time"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListPublications(c *gin.Context) {
	var query structs.PaginationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		query.Page = 1
		query.PerPage = 10
	}
	if query.Page < 1 {
		query.Page = 1
	}
	if query.PerPage < 1 || query.PerPage > 100 {
		query.PerPage = 10
	}

	db := config.DB.Model(&models.Publication{})
	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("title LIKE ? OR journal LIKE ? OR authors LIKE ?", s, s, s)
	}

	var total int64
	db.Count(&total)

	sortCol := "id"
	if query.Sort != "" {
		sortCol = query.Sort
	}
	sortOrder := "desc"
	if query.Order == "asc" {
		sortOrder = "asc"
	}

	var list []models.Publication
	offset := (query.Page - 1) * query.PerPage
	db.Order(sortCol + " " + sortOrder).Limit(query.PerPage).Offset(offset).Find(&list)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Publications retrieved",
		Data:    list,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func GetPublication(c *gin.Context) {
	id := c.Param("id")
	var pub models.Publication
	if err := config.DB.First(&pub, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Publication not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Publication retrieved",
		Data:    pub,
	})
}

func CreatePublication(c *gin.Context) {
	var req structs.PublicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	pubDate, _ := time.Parse("2006-01-02", req.PublicationDate)
	if pubDate.IsZero() {
		pubDate = time.Now()
	}

	pub := models.Publication{
		Title:           req.Title,
		Journal:         req.Journal,
		IndexType:       req.IndexType,
		PublicationDate: pubDate,
		DOI:             req.DOI,
		Url:             req.Url,
		Abstract:        req.Abstract,
		Authors:         req.Authors,
		Order:           req.Order,
	}

	if err := config.DB.Create(&pub).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create publication",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "publication", []string{"/publications"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Publication created successfully",
		Data:    pub,
	})
}

func UpdatePublication(c *gin.Context) {
	id := c.Param("id")
	var pub models.Publication
	if err := config.DB.First(&pub, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Publication not found",
			Data:    nil,
		})
		return
	}

	var req structs.PublicationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	if t, err := time.Parse("2006-01-02", req.PublicationDate); err == nil {
		pub.PublicationDate = t
	}

	pub.Title = req.Title
	pub.Journal = req.Journal
	pub.IndexType = req.IndexType
	pub.DOI = req.DOI
	pub.Url = req.Url
	pub.Abstract = req.Abstract
	pub.Authors = req.Authors
	pub.Order = req.Order

	config.DB.Save(&pub)
	services.TriggerRevalidation(config.DB, "publication", []string{"/publications"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Publication updated successfully",
		Data:    pub,
	})
}

func DeletePublication(c *gin.Context) {
	id := c.Param("id")
	var pub models.Publication
	if err := config.DB.First(&pub, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Publication not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&pub)
	services.TriggerRevalidation(config.DB, "publication", []string{"/publications"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Publication deleted successfully",
		Data:    nil,
	})
}
