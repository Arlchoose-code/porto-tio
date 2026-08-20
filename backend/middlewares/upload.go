package middlewares

import (
	"net/http"

	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

func MaxUploadSizeMiddleware(maxBytes int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		if err := c.Request.ParseMultipartForm(maxBytes); err != nil {
			c.JSON(http.StatusBadRequest, structs.Response{
				Status:  false,
				Message: "File upload size exceeded maximum limit",
				Data:    nil,
			})
			c.Abort()
			return
		}
		c.Next()
	}
}
