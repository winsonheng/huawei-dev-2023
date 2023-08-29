package language

import (
	"backend/dataaccess/languages"
	"backend/views/languageviews"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleList(context *gin.Context) {
	languages, err := languages.List()

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	languageViews := languageviews.ViewsFromArray(languages)
	
	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusOK, gin.H{"language": languageViews})
}