package routes

import (
	"portfolio-backend/controllers/public"

	"github.com/gin-gonic/gin"
)

func RegisterPublicRoutes(rg *gin.RouterGroup) {
	rg.GET("/health", HealthCheck)
	rg.GET("/settings", public.GetSiteInfo)
	rg.GET("/seo", public.GetSeoByPath)

	// Projects
	rg.GET("/projects", public.ListProjects)
	rg.GET("/projects/:slug", public.GetProjectBySlug)

	// Certificates
	rg.GET("/certificates", public.ListCertificates)

	// Experiences
	rg.GET("/experiences", public.ListExperiences)

	// Educations
	rg.GET("/educations", public.ListEducations)

	// Skills
	rg.GET("/skills", public.ListSkills)

	// Publications
	rg.GET("/publications", public.ListPublications)

	// Static Pages
	rg.GET("/pages/:slug", public.GetPageBySlug)
}
