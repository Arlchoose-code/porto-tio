package structs

type SiteSettingRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Logo        string `json:"logo"`
	Favicon     string `json:"favicon"`
	Address     string `json:"address"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	BioShort    string `json:"bio_short"`
	FooterText  string `json:"footer_text"`
	RobotsTxt   string `json:"robots_txt"`
}