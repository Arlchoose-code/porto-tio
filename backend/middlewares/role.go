package middlewares

import (
	"net/http"

	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func AdminOnlyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists || role != "admin" {
			c.JSON(http.StatusForbidden, structs.Response{
				Status:  false,
				Message: "Forbidden: Admin access required",
				Data:    nil,
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
