package utils

import (
	"backend/dataaccess/users"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func CurrentUser(context *gin.Context) (*models.User, error) {
	err := ValidateJWT(context)
	if err != nil {
		return nil, err
	}
	token, _ := getToken(context)
	claims, _ := token.Claims.(jwt.MapClaims)
	userId := uint(claims["id"].(float64))

	user, err := users.FindUserById(userId)
	if err != nil {
		return nil, err
	}
	return user, nil
}