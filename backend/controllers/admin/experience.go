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

func ListExperiences(c *gin.Context) {
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

	db := config.DB.Model(&models.Experience{})
	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("company LIKE ? OR position LIKE ? OR description LIKE ?", s, s, s)
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

	var list []models.Experience
	offset := (query.Page - 1) * query.PerPage
	db.Order(sortCol + " " + sortOrder).Limit(query.PerPage).Offset(offset).Find(&list)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Experiences retrieved",
		Data:    list,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func GetExperience(c *gin.Context) {
	id := c.Param("id")
	var exp models.Experience
	if err := config.DB.First(&exp, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Experience not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Experience retrieved",
		Data:    exp,
	})
}

func CreateExperience(c *gin.Context) {
	var req structs.ExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	startDate, _ := time.Parse("2006-01-02", req.StartDate)
	if startDate.IsZero() {
		startDate = time.Now()
	}

	var endDate *time.Time
	if req.EndDate != nil && *req.EndDate != "" {
		if t, err := time.Parse("2006-01-02", *req.EndDate); err == nil {
			endDate = &t
		}
	}

	exp := models.Experience{
		Company:        req.Company,
		Position:       req.Position,
		Location:       req.Location,
		EmploymentType: req.EmploymentType,
		StartDate:      startDate,
		EndDate:        endDate,
		IsCurrent:      req.IsCurrent,
		Description:    req.Description,
		Order:          req.Order,
	}

	if err := config.DB.Create(&exp).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create experience",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "experience", []string{"/experiences"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Experience created successfully",
		Data:    exp,
	})
}

func UpdateExperience(c *gin.Context) {
	id := c.Param("id")
	var exp models.Experience
	if err := config.DB.First(&exp, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Experience not found",
			Data:    nil,
		})
		return
	}

	var req structs.ExperienceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	if t, err := time.Parse("2006-01-02", req.StartDate); err == nil {
		exp.StartDate = t
	}
	if req.EndDate != nil && *req.EndDate != "" {
		if t, err := time.Parse("2006-01-02", *req.EndDate); err == nil {
			exp.EndDate = &t
		}
	} else {
		exp.EndDate = nil
	}

	exp.Company = req.Company
	exp.Position = req.Position
	exp.Location = req.Location
	exp.EmploymentType = req.EmploymentType
	exp.IsCurrent = req.IsCurrent
	exp.Description = req.Description
	exp.Order = req.Order

	config.DB.Save(&exp)
	services.TriggerRevalidation(config.DB, "experience", []string{"/experiences"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Experience updated successfully",
		Data:    exp,
	})
}

func DeleteExperience(c *gin.Context) {
	id := c.Param("id")
	var exp models.Experience
	if err := config.DB.First(&exp, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Experience not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&exp)
	services.TriggerRevalidation(config.DB, "experience", []string{"/experiences"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Experience deleted successfully",
		Data:    nil,
	})
}
