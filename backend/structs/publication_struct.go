package structs

type PublicationRequest struct {
	Title           string `json:"title" binding:"required"`
	Journal         string `json:"journal" binding:"required"`
	IndexType       string `json:"index_type"`
	PublicationDate string `json:"publication_date"`
	DOI             string `json:"doi"`
	Url             string `json:"url"`
	Abstract        string `json:"abstract"`
	Authors         string `json:"authors"`
	Order           int    `json:"order"`
}
