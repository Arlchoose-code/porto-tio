package routes

import (
	"portfolio-backend/controllers/admin"
	"portfolio-backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterAdminRoutes(rg *gin.RouterGroup) {
	auth := rg.Group("/auth")
	{
		auth.POST("/login", admin.Login)
		auth.POST("/logout", admin.Logout)
		auth.POST("/refresh", admin.RefreshToken)
		auth.GET("/me", middlewares.AuthMiddleware(), admin.Me)
		auth.PUT("/profile", middlewares.AuthMiddleware(), admin.UpdateProfile)
		auth.PUT("/password", middlewares.AuthMiddleware(), admin.UpdatePassword)
	}

	// Protected Admin Routes
	protected := rg.Group("")
	protected.Use(middlewares.AuthMiddleware(), middlewares.AdminOnlyMiddleware())
	{
		// Site Settings
		protected.GET("/settings", admin.GetSiteSetting)
		protected.PUT("/settings", admin.UpdateSiteSetting)

		// SEO Settings
		protected.GET("/seo", admin.ListSeoSettings)
		protected.POST("/seo", admin.CreateSeoSetting)
		protected.PUT("/seo/:id", admin.UpdateSeoSetting)
		protected.DELETE("/seo/:id", admin.DeleteSeoSetting)

		// Social Links
		protected.GET("/social-links", admin.ListSocialLinks)
		protected.POST("/social-links", admin.CreateSocialLink)
		protected.PUT("/social-links/:id", admin.UpdateSocialLink)
		protected.DELETE("/social-links/:id", admin.DeleteSocialLink)

		// Project Categories
		protected.GET("/project-categories", admin.ListProjectCategories)
		protected.POST("/project-categories", admin.CreateProjectCategory)
		protected.PUT("/project-categories/:id", admin.UpdateProjectCategory)
		protected.DELETE("/project-categories/:id", admin.DeleteProjectCategory)

		// Projects
		protected.GET("/projects", admin.ListProjects)
		protected.POST("/projects", admin.CreateProject)
		protected.GET("/projects/:id", admin.GetProject)
		protected.PUT("/projects/:id", admin.UpdateProject)
		protected.DELETE("/projects/:id", admin.DeleteProject)

		// Project Images
		protected.POST("/projects/:id/images", admin.UploadProjectImage)
		protected.DELETE("/project-images/:imageId", admin.DeleteProjectImage)
		protected.POST("/projects/:id/images/reorder", admin.ReorderProjectImages)

		// Certificates
		protected.GET("/certificates", admin.ListCertificates)
		protected.POST("/certificates", admin.CreateCertificate)
		protected.GET("/certificates/:id", admin.GetCertificate)
		protected.PUT("/certificates/:id", admin.UpdateCertificate)
		protected.DELETE("/certificates/:id", admin.DeleteCertificate)

		// Experiences
		protected.GET("/experiences", admin.ListExperiences)
		protected.POST("/experiences", admin.CreateExperience)
		protected.GET("/experiences/:id", admin.GetExperience)
		protected.PUT("/experiences/:id", admin.UpdateExperience)
		protected.DELETE("/experiences/:id", admin.DeleteExperience)

		// Educations
		protected.GET("/educations", admin.ListEducations)
		protected.POST("/educations", admin.CreateEducation)
		protected.GET("/educations/:id", admin.GetEducation)
		protected.PUT("/educations/:id", admin.UpdateEducation)
		protected.DELETE("/educations/:id", admin.DeleteEducation)

		// Skill Categories
		protected.GET("/skill-categories", admin.ListSkillCategories)
		protected.POST("/skill-categories", admin.CreateSkillCategory)
		protected.PUT("/skill-categories/:id", admin.UpdateSkillCategory)
		protected.DELETE("/skill-categories/:id", admin.DeleteSkillCategory)

		// Skills
		protected.GET("/skills", admin.ListSkills)
		protected.POST("/skills", admin.CreateSkill)
		protected.PUT("/skills/:id", admin.UpdateSkill)
		protected.DELETE("/skills/:id", admin.DeleteSkill)

		// Publications
		protected.GET("/publications", admin.ListPublications)
		protected.POST("/publications", admin.CreatePublication)
		protected.GET("/publications/:id", admin.GetPublication)
		protected.PUT("/publications/:id", admin.UpdatePublication)
		protected.DELETE("/publications/:id", admin.DeletePublication)

		// Media Library
		protected.GET("/media", admin.ListMedia)
		protected.POST("/media/upload", admin.UploadMedia)
		protected.DELETE("/media/:id", admin.DeleteMedia)

		// Static Pages
		protected.GET("/pages", admin.ListPages)
		protected.POST("/pages", admin.CreatePage)
		protected.GET("/pages/:id", admin.GetPage)
		protected.PUT("/pages/:id", admin.UpdatePage)
		protected.DELETE("/pages/:id", admin.DeletePage)
	}
}
