package services

import (
	"crypto/rand"
	"encoding/hex"
	"time"

	"portfolio-backend/config"
	"portfolio-backend/models"

	"gorm.io/gorm"
)

func GenerateRefreshToken(db *gorm.DB, userID uint) (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	tokenStr := hex.EncodeToString(bytes)

	cfg := config.AppConfig
	duration, err := time.ParseDuration(cfg.JWTRefreshExpire)
	if err != nil {
		duration = 168 * time.Hour // 7 days default
	}

	// Revoke old tokens for this user
	db.Model(&models.PersonalAccessToken{}).
		Where("user_id = ? AND revoked = ?", userID, false).
		Update("revoked", true)

	token := models.PersonalAccessToken{
		UserID:    userID,
		Token:     tokenStr,
		ExpiresAt: time.Now().Add(duration),
		Revoked:   false,
	}

	if err := db.Create(&token).Error; err != nil {
		return "", err
	}

	return tokenStr, nil
}

func ValidateRefreshToken(db *gorm.DB, tokenStr string) (*models.PersonalAccessToken, error) {
	var token models.PersonalAccessToken
	err := db.Where("token = ? AND revoked = ? AND expires_at > ?", tokenStr, false, time.Now()).
		First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func RevokeRefreshToken(db *gorm.DB, tokenStr string) error {
	return db.Model(&models.PersonalAccessToken{}).
		Where("token = ?", tokenStr).
		Update("revoked", true).Error
}
