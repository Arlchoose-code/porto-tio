package structs

type ProjectCategoryRequest struct {
	Name  string `json:"name" binding:"required"`
	Slug  string `json:"slug"`
	Order int    `json:"order"`
}

type ProjectRequest struct {
	CategoryID   uint   `json:"category_id"`
	Title        string `json:"title" binding:"required"`
	Slug         string `json:"slug"`
	Subtitle     string `json:"subtitle"`
	Description  string `json:"description"`
	Content      string `json:"content"`
	ThumbnailUrl string `json:"thumbnail_url"`
	MediumUrl    string `json:"medium_url"`
	OriginalUrl  string `json:"original_url"`
	DemoUrl      string `json:"demo_url"`
	RepoUrl      string `json:"repo_url"`
	Status       string `json:"status"`
	Featured     bool   `json:"featured"`
	Order        int    `json:"order"`
}

type ProjectImageRequest struct {
	Caption      string `json:"caption"`
	Order        int    `json:"order"`
	ThumbnailUrl string `json:"thumbnail_url"`
	MediumUrl    string `json:"medium_url"`
	OriginalUrl  string `json:"original_url" binding:"required"`
}

type ProjectImageReorderRequest struct {
	ImageIDs []uint `json:"image_ids" binding:"required"`
}
