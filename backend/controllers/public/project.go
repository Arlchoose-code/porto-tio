package public

import (
	"math"
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListProjects(c *gin.Context) {
	var query structs.PaginationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		query.Page = 1
		query.PerPage = 12
	}
	if query.Page < 1 {
		query.Page = 1
	}
	if query.PerPage < 1 || query.PerPage > 100 {
		query.PerPage = 12
	}

	categorySlug := c.Query("category")
	featured := c.Query("featured")

	db := config.DB.Model(&models.Project{}).Where("status = ?", "published").Preload("Category").Preload("Images")

	if categorySlug != "" {
		var cat models.ProjectCategory
		if err := config.DB.Where("slug = ?", categorySlug).First(&cat).Error; err == nil {
			db = db.Where("category_id = ?", cat.ID)
		}
	}

	if featured == "true" {
		db = db.Where("featured = ?", true)
	}

	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("title LIKE ? OR subtitle LIKE ? OR description LIKE ?", s, s, s)
	}

	var total int64
	db.Count(&total)

	var projects []models.Project
	offset := (query.Page - 1) * query.PerPage
	db.Order("`order` asc, id desc").Limit(query.PerPage).Offset(offset).Find(&projects)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Projects retrieved",
		Data:    projects,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func GetProjectBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var project models.Project
	if err := config.DB.Preload("Category").Preload("Images").Where("slug = ?", slug).First(&project).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Project not found",
			Data:    nil,
		})
		return
	}

	// Increment view count
	config.DB.Model(&project).UpdateColumn("views", project.Views+1)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project retrieved",
		Data:    project,
	})
}
