package user

import (
	"backend/dataaccess/users"
	"backend/models"
	"backend/params/auth"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(context *gin.Context) {
	var registerParams auth.AuthenticationParams

	if err := context.ShouldBindJSON(&registerParams); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		Username: registerParams.Username,
		Password: registerParams.Password,
	}

	savedUser, err := users.Create(&user)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusCreated, gin.H{"user": savedUser})
}