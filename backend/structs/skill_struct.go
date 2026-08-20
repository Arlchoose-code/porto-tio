package structs

type SkillCategoryRequest struct {
	Name  string `json:"name" binding:"required"`
	Slug  string `json:"slug"`
	Order int    `json:"order"`
}

type SkillRequest struct {
	CategoryID  uint   `json:"category_id" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Proficiency int    `json:"proficiency"`
	Icon        string `json:"icon"`
	Order       int    `json:"order"`
}
