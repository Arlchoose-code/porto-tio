package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func GetSeoByPath(c *gin.Context) {
	path := c.Query("path")
	if path == "" {
		path = "/"
	}

	seo, err := services.GetSeoForPath(config.DB, path)
	if err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "SEO setting not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "SEO setting retrieved",
		Data:    seo,
	})
}
