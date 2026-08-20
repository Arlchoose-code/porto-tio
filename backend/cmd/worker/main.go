package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"portfolio-backend/config"
	"portfolio-backend/workers"
)

func main() {
	cfg := config.LoadConfig()
	db := config.ConnectDatabase(cfg)

	worker := workers.NewRevalidationWorker(db, cfg)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go worker.Start(ctx)

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	log.Println("Shutting down revalidation worker gracefully...")
}
