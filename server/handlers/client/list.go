package client

import (
	"backend/dataaccess/clients"
	"backend/views/clientviews"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleList(context *gin.Context) {
	clients, err := clients.List()

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clientViews := clientviews.ViewsFromArray(clients)
	
	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusOK, gin.H{"clients": clientViews})
}