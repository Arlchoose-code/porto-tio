package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func GetPageBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var page models.Page
	if err := config.DB.Where("slug = ? AND status = ?", slug, "published").First(&page).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "Page not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Page retrieved",
		Data:    page,
	})
}
