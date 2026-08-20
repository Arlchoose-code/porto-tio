package structs

type RevalidateRequest struct {
	Paths []string `json:"paths" binding:"required"`
}
