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

func ListEducations(c *gin.Context) {
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

	db := config.DB.Model(&models.Education{})
	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("institution LIKE ? OR major LIKE ? OR degree LIKE ?", s, s, s)
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

	var list []models.Education
	offset := (query.Page - 1) * query.PerPage
	db.Order(sortCol + " " + sortOrder).Limit(query.PerPage).Offset(offset).Find(&list)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Educations retrieved",
		Data:    list,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func GetEducation(c *gin.Context) {
	id := c.Param("id")
	var edu models.Education
	if err := config.DB.First(&edu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Education not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Education retrieved",
		Data:    edu,
	})
}

func CreateEducation(c *gin.Context) {
	var req structs.EducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	edu := models.Education{
		Institution: req.Institution,
		Degree:      req.Degree,
		Major:       req.Major,
		GPA:         req.GPA,
		StartYear:   req.StartYear,
		EndYear:     req.EndYear,
		Description: req.Description,
		Order:       req.Order,
	}

	if err := config.DB.Create(&edu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create education",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "education", []string{"/educations"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Education created successfully",
		Data:    edu,
	})
}

func UpdateEducation(c *gin.Context) {
	id := c.Param("id")
	var edu models.Education
	if err := config.DB.First(&edu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Education not found",
			Data:    nil,
		})
		return
	}

	var req structs.EducationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	edu.Institution = req.Institution
	edu.Degree = req.Degree
	edu.Major = req.Major
	edu.GPA = req.GPA
	edu.StartYear = req.StartYear
	edu.EndYear = req.EndYear
	edu.Description = req.Description
	edu.Order = req.Order

	config.DB.Save(&edu)
	services.TriggerRevalidation(config.DB, "education", []string{"/educations"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Education updated successfully",
		Data:    edu,
	})
}

func DeleteEducation(c *gin.Context) {
	id := c.Param("id")
	var edu models.Education
	if err := config.DB.First(&edu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Education not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&edu)
	services.TriggerRevalidation(config.DB, "education", []string{"/educations"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Education deleted successfully",
		Data:    nil,
	})
}
