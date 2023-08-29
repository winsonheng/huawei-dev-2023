package user

import (
	"backend/dataaccess/users"
	"backend/params/auth"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Login(context *gin.Context) {
	var loginParams auth.AuthenticationParams

	if err := context.ShouldBindJSON(&loginParams); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := users.FindUserByUsername(loginParams.Username)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = user.ValidatePassword(loginParams.Password)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	jwt, err := utils.GenerateJWT(user)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusOK, gin.H{"jwt": jwt})
}