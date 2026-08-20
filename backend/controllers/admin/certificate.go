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

func ListCertificates(c *gin.Context) {
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

	db := config.DB.Model(&models.Certificate{})
	if query.Search != "" {
		s := "%" + query.Search + "%"
		db = db.Where("name LIKE ? OR issuer LIKE ? OR credential_id LIKE ?", s, s, s)
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

	var certs []models.Certificate
	offset := (query.Page - 1) * query.PerPage
	db.Order(sortCol + " " + sortOrder).Limit(query.PerPage).Offset(offset).Find(&certs)

	totalPages := int(math.Ceil(float64(total) / float64(query.PerPage)))

	c.JSON(http.StatusOK, structs.ResponseWithMeta{
		Status:  true,
		Message: "Certificates retrieved",
		Data:    certs,
		Meta: structs.Meta{
			Page:       query.Page,
			PerPage:    query.PerPage,
			Total:      total,
			TotalPages: totalPages,
		},
	})
}

func GetCertificate(c *gin.Context) {
	id := c.Param("id")
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Certificate not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Certificate retrieved",
		Data:    cert,
	})
}

func CreateCertificate(c *gin.Context) {
	var req structs.CertificateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input: " + err.Error(),
			Data:    nil,
		})
		return
	}

	issueDate, _ := time.Parse("2006-01-02", req.IssueDate)
	if issueDate.IsZero() {
		issueDate = time.Now()
	}

	var expDate *time.Time
	if req.ExpirationDate != nil && *req.ExpirationDate != "" {
		if t, err := time.Parse("2006-01-02", *req.ExpirationDate); err == nil {
			expDate = &t
		}
	}

	cert := models.Certificate{
		Name:           req.Name,
		Issuer:         req.Issuer,
		IssueDate:      issueDate,
		ExpirationDate: expDate,
		CredentialID:   req.CredentialID,
		CredentialURL:  req.CredentialURL,
		ThumbnailUrl:   req.ThumbnailUrl,
		MediumUrl:      req.MediumUrl,
		OriginalUrl:    req.OriginalUrl,
		Description:    req.Description,
		Order:          req.Order,
	}

	if err := config.DB.Create(&cert).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to create certificate",
			Data:    nil,
		})
		return
	}

	services.TriggerRevalidation(config.DB, "certificate", []string{"/certificates"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Certificate created successfully",
		Data:    cert,
	})
}

func UpdateCertificate(c *gin.Context) {
	id := c.Param("id")
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Certificate not found",
			Data:    nil,
		})
		return
	}

	var req structs.CertificateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid input",
			Data:    nil,
		})
		return
	}

	if t, err := time.Parse("2006-01-02", req.IssueDate); err == nil {
		cert.IssueDate = t
	}
	if req.ExpirationDate != nil && *req.ExpirationDate != "" {
		if t, err := time.Parse("2006-01-02", *req.ExpirationDate); err == nil {
			cert.ExpirationDate = &t
		}
	} else {
		cert.ExpirationDate = nil
	}

	cert.Name = req.Name
	cert.Issuer = req.Issuer
	cert.CredentialID = req.CredentialID
	cert.CredentialURL = req.CredentialURL
	cert.ThumbnailUrl = req.ThumbnailUrl
	cert.MediumUrl = req.MediumUrl
	cert.OriginalUrl = req.OriginalUrl
	cert.Description = req.Description
	cert.Order = req.Order

	config.DB.Save(&cert)
	services.TriggerRevalidation(config.DB, "certificate", []string{"/certificates"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Certificate updated successfully",
		Data:    cert,
	})
}

func DeleteCertificate(c *gin.Context) {
	id := c.Param("id")
	var cert models.Certificate
	if err := config.DB.First(&cert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Certificate not found",
			Data:    nil,
		})
		return
	}

	config.DB.Delete(&cert)
	services.TriggerRevalidation(config.DB, "certificate", []string{"/certificates"})

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Certificate deleted successfully",
		Data:    nil,
	})
}
