package structs

type SiteSettingRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	Logo        string `json:"logo"`
	Favicon     string `json:"favicon"`
	Address     string `json:"address"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	BioShort        string `json:"bio_short"`
	FooterText      string `json:"footer_text"`
	RobotsTxt       string `json:"robots_txt"`
	HeroBadge       string `json:"hero_badge"`
	HeroTitle       string `json:"hero_title"`
	HeroDescription string `json:"hero_description"`
	HeroImage        string `json:"hero_image"`
	HeroCardTitle    string `json:"hero_card_title"`
	HeroCardStatus   string `json:"hero_card_status"`
	HeroCardSubtitle string `json:"hero_card_subtitle"`
	HeroStats        string `json:"hero_stats"`
}