package text

import (
	"backend/dataaccess/texts"
	"backend/views/textviews"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func HandleList(context *gin.Context) {
	// retrieve query params
	// url should be translations?client={clientID}&language={languageID}
	clientID, err := strconv.ParseInt(context.Query("client"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	languageID, err := strconv.ParseInt(context.Query("language"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	texts, err := texts.List(clientID, languageID)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	textViews := textviews.ViewsFromArray(texts)

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusOK, gin.H{"texts": textViews})
}