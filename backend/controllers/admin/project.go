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

func ListProjects(c *gin.Context) {
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

	db := config.DB.Model(&models.Project{}).Preload("Category").Preload("Images")

	if query.Search != "" {
		search := "%" + query.Search + "%"
		db = db.Where("title LIKE ? OR subtitle LIKE ? OR description LIKE ?", search, search, search)
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

	var projects []models.Project
	offset := (query.Page - 1) * query.PerPage
	db.Order(sortCol + " " + sortOrder).Limit(query.PerPage).Offset(offset).Find(&projects)

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

func GetProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := config.DB.Preload("Category").Preload("Images").First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Project not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project retrieved",
		Data:    project,
	})
}

func CreateProject(c *gin.Context) {
	var req structs.ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	slug := req.Slug
	if slug == "" {
		slug = services.GenerateUniqueSlug(config.DB, "projects", req.Title, 0)
	} else {
		slug = services.GenerateUniqueSlug(config.DB, "projects", slug, 0)
	}

	status := req.Status
	if status == "" {
		status = "published"
	}

	project := models.Project{
		CategoryID:   req.CategoryID,
		Title:        req.Title,
		Slug:         slug,
		Subtitle:     req.Subtitle,
		Description:  req.Description,
		Content:      req.Content,
		ThumbnailUrl: req.ThumbnailUrl,
		MediumUrl:    req.MediumUrl,
		OriginalUrl:  req.OriginalUrl,
		DemoUrl:      req.DemoUrl,
		RepoUrl:      req.RepoUrl,
		Status:       status,
		Featured:     req.Featured,
		Order:        req.Order,
	}

	if err := config.DB.Create(&project).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create project",
			Data:    nil,
		})
		return
	}

	config.DB.Preload("Category").Preload("Images").First(&project, project.ID)
	services.TriggerRevalidation(config.DB, "project", []string{"/", "/projects", "/projects/" + project.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project created successfully",
		Data:    project,
	})
}

func UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := config.DB.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Project not found",
			Data:    nil,
		})
		return
	}

	var req structs.ProjectRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	slug := project.Slug
	if req.Slug != "" && req.Slug != project.Slug {
		slug = services.GenerateUniqueSlug(config.DB, "projects", req.Slug, project.ID)
	}

	project.CategoryID = req.CategoryID
	project.Title = req.Title
	project.Slug = slug
	project.Subtitle = req.Subtitle
	project.Description = req.Description
	project.Content = req.Content
	project.ThumbnailUrl = req.ThumbnailUrl
	project.MediumUrl = req.MediumUrl
	project.OriginalUrl = req.OriginalUrl
	project.DemoUrl = req.DemoUrl
	project.RepoUrl = req.RepoUrl
	if req.Status != "" {
		project.Status = req.Status
	}
	project.Featured = req.Featured
	project.Order = req.Order

	config.DB.Save(&project)
	config.DB.Preload("Category").Preload("Images").First(&project, project.ID)

	services.TriggerRevalidation(config.DB, "project", []string{"/", "/projects", "/projects/" + project.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project updated successfully",
		Data:    project,
	})
}

func DeleteProject(c *gin.Context) {
	id := c.Param("id")
	var project models.Project
	if err := config.DB.First(&project, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Project not found",
			Data:    nil,
		})
		return
	}

	// Delete associated images
	config.DB.Where("project_id = ?", project.ID).Delete(&models.ProjectImage{})
	config.DB.Delete(&project)

	services.TriggerRevalidation(config.DB, "project", []string{"/", "/projects", "/projects/" + project.Slug})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project deleted successfully",
		Data:    nil,
	})
}
