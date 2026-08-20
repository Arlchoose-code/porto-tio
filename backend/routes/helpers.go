package routes

import (
	"net/http"

	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Backend API is running healthy",
		Data: gin.H{
			"service": "portfolio-backend",
			"status":  "operational",
		},
	})
}
