package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"portfolio-backend/config"
	"portfolio-backend/database"
	"portfolio-backend/middlewares"
	"portfolio-backend/routes"
	"portfolio-backend/workers"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	db := config.ConnectDatabase(cfg)

	// Run Database Auto-Migrations
	database.Migrate(db)

	// Run Seeders
	database.Seed(db)

	// Ensure media directories exist
	_ = os.MkdirAll(filepath.Join(cfg.StoragePath, "originals"), 0755)
	_ = os.MkdirAll(filepath.Join(cfg.StoragePath, "medium"), 0755)
	_ = os.MkdirAll(filepath.Join(cfg.StoragePath, "thumbnails"), 0755)

	// Start Background Revalidation Worker
	worker := workers.NewRevalidationWorker(db, cfg)
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go worker.Start(ctx)

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Global Middlewares
	r.Use(middlewares.RequestIDMiddleware())
	r.Use(middlewares.CORSMiddleware())

	// Static Storage Handler for Uploaded Media
	r.Static("/storage/media", cfg.StoragePath)

	// API Routes Group
	api := r.Group("/api")
	{
		routes.RegisterPublicRoutes(api)
		routes.RegisterAdminRoutes(api.Group("/admin"))
	}

	addr := fmt.Sprintf(":%s", cfg.AppPort)
	log.Printf("Portfolio Backend API running on http://localhost%s\n", addr)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
