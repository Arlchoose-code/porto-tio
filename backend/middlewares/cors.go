package middlewares

import (
	"net/http"
	"strings"

	"portfolio-backend/config"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cfg := config.AppConfig
		origin := c.Request.Header.Get("Origin")

		allowedOrigins := strings.Split(cfg.CORSAllowedOrigins, ",")
		isAllowed := false

		for _, o := range allowedOrigins {
			trimmed := strings.TrimSpace(o)
			if origin == trimmed || trimmed == "*" {
				isAllowed = true
				break
			}
		}

		if isAllowed && origin != "" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Request-ID")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
