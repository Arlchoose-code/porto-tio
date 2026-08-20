package public

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
)

type PublicSiteInfoResponse struct {
	SiteSetting models.SiteSetting  `json:"site_setting"`
	SocialLinks []models.SocialLink `json:"social_links"`
}

func GetSiteInfo(c *gin.Context) {
	var siteSetting models.SiteSetting
	config.DB.First(&siteSetting)

	var socialLinks []models.SocialLink
	config.DB.Where("is_active = ?", true).Order("`order` asc, id asc").Find(&socialLinks)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Site information retrieved",
		Data: PublicSiteInfoResponse{
			SiteSetting: siteSetting,
			SocialLinks: socialLinks,
		},
	})
}
