package structs

type SeoSettingRequest struct {
	Path            string `json:"path" binding:"required"`
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
	OgTitle         string `json:"og_title"`
	OgDescription   string `json:"og_description"`
	OgImage         string `json:"og_image"`
	CanonicalUrl    string `json:"canonical_url"`
	JsonLd          string `json:"json_ld"`
}
