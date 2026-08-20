package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListCertificates(c *gin.Context) {
	var certs []models.Certificate
	config.DB.Order("`order` asc, issue_date desc").Find(&certs)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Certificates retrieved",
		Data:    certs,
	})
}
