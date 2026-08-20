package structs

type ExperienceRequest struct {
	Company        string  `json:"company" binding:"required"`
	Position       string  `json:"position" binding:"required"`
	Location       string  `json:"location"`
	EmploymentType string  `json:"employment_type"`
	StartDate      string  `json:"start_date" binding:"required"`
	EndDate        *string `json:"end_date"`
	IsCurrent      bool    `json:"is_current"`
	Description    string  `json:"description"`
	Order          int     `json:"order"`
}
