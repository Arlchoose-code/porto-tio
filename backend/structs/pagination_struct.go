package structs

type PaginationQuery struct {
	Page    int    `form:"page,default=1"`
	PerPage int    `form:"per_page,default=10"`
	Search  string `form:"search"`
	Sort    string `form:"sort,default=created_at"`
	Order   string `form:"order,default=desc"`
}
