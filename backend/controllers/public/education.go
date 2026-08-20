package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListEducations(c *gin.Context) {
	var list []models.Education
	config.DB.Order("`order` asc, end_year desc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Educations retrieved",
		Data:    list,
	})
}
