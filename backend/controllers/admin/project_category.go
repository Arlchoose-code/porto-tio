package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListProjectCategories(c *gin.Context) {
	var list []models.ProjectCategory
	config.DB.Order("`order` asc, id asc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project categories retrieved",
		Data:    list,
	})
}

func CreateProjectCategory(c *gin.Context) {
	var req structs.ProjectCategoryRequest
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
		slug = services.GenerateUniqueSlug(config.DB, "project_categories", req.Name, 0)
	}

	cat := models.ProjectCategory{
		Name:  req.Name,
		Slug:  slug,
		Order: req.Order,
	}

	if err := config.DB.Create(&cat).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create category",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project category created successfully",
		Data:    cat,
	})
}

func UpdateProjectCategory(c *gin.Context) {
	id := c.Param("id")
	var cat models.ProjectCategory
	if err := config.DB.First(&cat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Category not found",
			Data:    nil,
		})
		return
	}

	var req structs.ProjectCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	slug := req.Slug
	if slug == "" || slug != cat.Slug {
		slug = services.GenerateUniqueSlug(config.DB, "project_categories", req.Name, cat.ID)
	}

	cat.Name = req.Name
	cat.Slug = slug
	cat.Order = req.Order

	config.DB.Save(&cat)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project category updated successfully",
		Data:    cat,
	})
}

func DeleteProjectCategory(c *gin.Context) {
	id := c.Param("id")
	var cat models.ProjectCategory
	if err := config.DB.First(&cat, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Category not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&cat)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Project category deleted successfully",
		Data:    nil,
	})
}
