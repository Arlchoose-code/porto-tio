package config

import (
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv                 string
	AppPort                string
	AppURL                 string
	DBHost                 string
	DBPort                 string
	DBUser                 string
	DBPass                 string
	DBName                 string
	JWTSecret              string
	JWTAccessExpire        string
	JWTRefreshExpire       string
	StoragePath            string
	NextJSURL              string
	NextJSRevalidateSecret string
	CORSAllowedOrigins     string
}

var AppConfig *Config

func LoadConfig() *Config {
	_ = godotenv.Load()

	AppConfig = &Config{
		AppEnv:                 getEnv("APP_ENV", "development"),
		AppPort:                getEnv("APP_PORT", "8080"),
		AppURL:                 getEnv("APP_URL", "http://localhost:8080"),
		DBHost:                 getEnv("DB_HOST", "127.0.0.1"),
		DBPort:                 getEnv("DB_PORT", "3306"),
		DBUser:                 getEnv("DB_USER", "root"),
		DBPass:                 getEnv("DB_PASS", ""),
		DBName:                 getEnv("DB_NAME", "portofolio_tio"),
		JWTSecret:              getEnv("JWT_SECRET", "super_secret_jwt_key_sulistio_murti_mulyono_2026"),
		JWTAccessExpire:        getEnv("JWT_ACCESS_EXPIRE", "15m"),
		JWTRefreshExpire:       getEnv("JWT_REFRESH_EXPIRE", "168h"),
		StoragePath:            getEnv("STORAGE_PATH", "./storage/media"),
		NextJSURL:              getEnv("NEXTJS_URL", "http://localhost:3000"),
		NextJSRevalidateSecret: getEnv("NEXTJS_REVALIDATE_SECRET", "tio_revalidation_secret_key_2026"),
		CORSAllowedOrigins:     getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000"),
	}
	return AppConfig
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
