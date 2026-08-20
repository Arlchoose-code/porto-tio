package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListExperiences(c *gin.Context) {
	var list []models.Experience
	config.DB.Order("`order` asc, start_date desc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Experiences retrieved",
		Data:    list,
	})
}
