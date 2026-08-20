package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func ListPublications(c *gin.Context) {
	var list []models.Publication
	config.DB.Order("`order` asc, publication_date desc").Find(&list)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Publications retrieved",
		Data:    list,
	})
}
