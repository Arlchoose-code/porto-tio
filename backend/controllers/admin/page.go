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

func ListPages(c *gin.Context) {
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

	db := config.DB.Model(&models.Page{})
	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("title LIKE ? OR slug LIKE ?", s, s)
	}

	var total int64
	db.Count(&total)

	var list []models.Page
	offset := (query.Page - 1) * query.PerPage
	db.Order("id desc").Limit(query.PerPage).Offset(offset).Find(&list)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Pages retrieved",
		Data:    list,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func GetPage(c *gin.Context) {
	id := c.Param("id")
	var page models.Page
	if err := config.DB.First(&page, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Page not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Page retrieved",
		Data:    page,
	})
}

func CreatePage(c *gin.Context) {
	var req structs.PageRequest
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
		slug = services.GenerateUniqueSlug(config.DB, "pages", req.Title, 0)
	} else {
		slug = services.GenerateUniqueSlug(config.DB, "pages", slug, 0)
	}

	status := req.Status
	if status == "" {
		status = "published"
	}

	page := models.Page{
		Title:           req.Title,
		Slug:            slug,
		Content:         req.Content,
		Status:          status,
		MetaTitle:       req.MetaTitle,
		MetaDescription: req.MetaDescription,
	}

	if err := config.DB.Create(&page).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create page",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "page", []string{"/" + page.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Page created successfully",
		Data:    page,
	})
}

func UpdatePage(c *gin.Context) {
	id := c.Param("id")
	var page models.Page
	if err := config.DB.First(&page, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Page not found",
			Data:    nil,
		})
		return
	}

	var req structs.PageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	slug := page.Slug
	if req.Slug != "" && req.Slug != page.Slug {
		slug = services.GenerateUniqueSlug(config.DB, "pages", req.Slug, page.ID)
	}

	page.Title = req.Title
	page.Slug = slug
	page.Content = req.Content
	if req.Status != "" {
		page.Status = req.Status
	}
	page.MetaTitle = req.MetaTitle
	page.MetaDescription = req.MetaDescription

	config.DB.Save(&page)
	services.TriggerRevalidation(config.DB, "page", []string{"/" + page.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Page updated successfully",
		Data:    page,
	})
}

func DeletePage(c *gin.Context) {
	id := c.Param("id")
	var page models.Page
	if err := config.DB.First(&page, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Page not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&page)
	services.TriggerRevalidation(config.DB, "page", []string{"/" + page.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Page deleted successfully",
		Data:    nil,
	})
}
