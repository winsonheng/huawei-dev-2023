package client

import (
	"backend/dataaccess/clients"
	"backend/params/client"
	"backend/views/clientviews"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleCreate(context *gin.Context) {
	var createParams client.CreateParams

	if err := context.ShouldBindJSON(&createParams); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	model := client.ToModel(&createParams)

	client, err := clients.Create(model)
	
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clientView := clientviews.ViewFrom(client)

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusOK, gin.H{"client": clientView})
}