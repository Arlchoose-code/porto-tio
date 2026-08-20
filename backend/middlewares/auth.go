package middlewares

import (
	"net/http"
	"strings"

	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenString string

		// 1. Check HttpOnly cookie
		if cookie, err := c.Cookie("access_token"); err == nil && cookie != "" {
			tokenString = cookie
		}

		// 2. Check Authorization Bearer header
		if tokenString == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
				tokenString = strings.TrimPrefix(authHeader, "Bearer ")
			}
		}

		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, structs.Response{
				Status:  false,
				Message: "Unauthorized: Missing authentication token",
				Data:    nil,
			})
			c.Abort()
			return
		}

		claims, err := services.ValidateAccessToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, structs.Response{
				Status:  false,
				Message: "Unauthorized: Invalid or expired token",
				Data:    nil,
			})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRole", claims.Role)
		c.Next()
	}
}
