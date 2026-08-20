package structs

type SocialLinkRequest struct {
	Platform string `json:"platform" binding:"required"`
	Url      string `json:"url" binding:"required"`
	Icon     string `json:"icon"`
	Order    int    `json:"order"`
	IsActive bool   `json:"is_active"`
}
