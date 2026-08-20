package structs

type EducationRequest struct {
	Institution string `json:"institution" binding:"required"`
	Degree      string `json:"degree"`
	Major       string `json:"major"`
	GPA         string `json:"gpa"`
	StartYear   int    `json:"start_year"`
	EndYear     int    `json:"end_year"`
	Description string `json:"description"`
	Order       int    `json:"order"`
}
