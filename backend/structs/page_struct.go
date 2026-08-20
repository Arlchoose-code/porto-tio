package structs

type PageRequest struct {
	Title           string `json:"title" binding:"required"`
	Slug            string `json:"slug"`
	Content         string `json:"content"`
	Status          string `json:"status"`
	MetaTitle       string `json:"meta_title"`
	MetaDescription string `json:"meta_description"`
}
