package structs

type CertificateRequest struct {
	Name           string  `json:"name" binding:"required"`
	Issuer         string  `json:"issuer" binding:"required"`
	IssueDate      string  `json:"issue_date" binding:"required"`
	ExpirationDate *string `json:"expiration_date"`
	CredentialID   string  `json:"credential_id"`
	CredentialURL  string  `json:"credential_url"`
	ThumbnailUrl   string  `json:"thumbnail_url"`
	MediumUrl      string  `json:"medium_url"`
	OriginalUrl    string  `json:"original_url"`
	Description    string  `json:"description"`
	Order          int     `json:"order"`
}
