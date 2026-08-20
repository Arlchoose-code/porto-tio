package structs

type MediaResponse struct {
	ID           uint   `json:"id"`
	Filename     string `json:"filename"`
	OriginalName string `json:"original_name"`
	FileSize     int64  `json:"file_size"`
	MimeType     string `json:"mime_type"`
	ThumbnailUrl string `json:"thumbnail_url"`
	MediumUrl    string `json:"medium_url"`
	OriginalUrl  string `json:"original_url"`
	CreatedAt    string `json:"created_at"`
}
