package admin

import (
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/models"
	"portfolio-backend/services"
	"portfolio-backend/structs"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	var req structs.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid email or password format",
			Data:    nil,
		})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Invalid email or password",
			Data:    nil,
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Invalid email or password",
			Data:    nil,
		})
		return
	}

	accessToken, err := services.GenerateAccessToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to generate access token",
			Data:    nil,
		})
		return
	}

	refreshToken, err := services.GenerateRefreshToken(config.DB, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to generate refresh token",
			Data:    nil,
		})
		return
	}

	// Set HttpOnly Cookies
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("access_token", accessToken, 15*60, "/", "", false, true)
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "", false, true)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Login successful",
		Data: structs.LoginResponse{
			User: structs.UserResponse{
				ID:    user.ID,
				Name:  user.Name,
				Email: user.Email,
				Role:  user.Role,
			},
			AccessToken: accessToken,
		},
	})
}

func Logout(c *gin.Context) {
	if refreshToken, err := c.Cookie("refresh_token"); err == nil && refreshToken != "" {
		_ = services.RevokeRefreshToken(config.DB, refreshToken)
	}

	c.SetCookie("access_token", "", -1, "/", "", false, true)
	c.SetCookie("refresh_token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Logged out successfully",
		Data:    nil,
	})
}

func RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil || refreshToken == "" {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Refresh token missing",
			Data:    nil,
		})
		return
	}

	tokenRecord, err := services.ValidateRefreshToken(config.DB, refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Invalid or expired refresh token",
			Data:    nil,
		})
		return
	}

	var user models.User
	if err := config.DB.First(&user, tokenRecord.UserID).Error; err != nil {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "User not found",
			Data:    nil,
		})
		return
	}

	newAccessToken, err := services.GenerateAccessToken(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to generate access token",
			Data:    nil,
		})
		return
	}

	newRefreshToken, err := services.GenerateRefreshToken(config.DB, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to rotate refresh token",
			Data:    nil,
		})
		return
	}

	c.SetCookie("access_token", newAccessToken, 15*60, "/", "", false, true)
	c.SetCookie("refresh_token", newRefreshToken, 7*24*60*60, "/", "", false, true)

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Token refreshed successfully",
		Data: gin.H{
			"access_token": newAccessToken,
		},
	})
}

func Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Unauthorized",
			Data:    nil,
		})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "User not found",
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Current user profile",
		Data: structs.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}

func UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Unauthorized",
			Data:    nil,
		})
		return
	}

	var req structs.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid profile data format: " + err.Error(),
			Data:    nil,
		})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "User not found",
			Data:    nil,
		})
		return
	}

	// Check if new email is already taken by another account
	var count int64
	config.DB.Model(&models.User{}).Where("email = ? AND id != ?", req.Email, user.ID).Count(&count)
	if count > 0 {
		c.JSON(http.StatusConflict, structs.Response{
			Status:  false,
			Message: "Email address is already in use by another account",
			Data:    nil,
		})
		return
	}

	user.Name = req.Name
	user.Email = req.Email

	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to update profile: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Profile updated successfully",
		Data: structs.UserResponse{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}

func UpdatePassword(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, structs.Response{
			Status:  false,
			Message: "Unauthorized",
			Data:    nil,
		})
		return
	}

	var req structs.UpdatePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Invalid password format: " + err.Error(),
			Data:    nil,
		})
		return
	}

	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "New password and confirmation password do not match",
			Data:    nil,
		})
		return
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, structs.Response{
			Status:  false,
			Message: "User not found",
			Data:    nil,
		})
		return
	}

	// Verify current password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
		c.JSON(http.StatusBadRequest, structs.Response{
			Status:  false,
			Message: "Current password is incorrect",
			Data:    nil,
		})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to encrypt new password",
			Data:    nil,
		})
		return
	}

	user.Password = string(hashedPassword)
	if err := config.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, structs.Response{
			Status:  false,
			Message: "Failed to update password: " + err.Error(),
			Data:    nil,
		})
		return
	}

	c.JSON(http.StatusOK, structs.Response{
		Status:  true,
		Message: "Password updated successfully",
		Data:    nil,
	})
}

