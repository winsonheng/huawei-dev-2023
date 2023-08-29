package text

import (
	"backend/dataaccess/texts"
	"backend/params/text"
	"backend/views/textviews"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleCreate(context *gin.Context) {
	var createParams *text.CreateParams

	if err := context.ShouldBindJSON(&createParams); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	textModel, clientTextModel := text.ToModel(createParams)

	text, err := texts.Create(textModel, clientTextModel)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	textView := textviews.ViewFrom(text)

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusCreated, gin.H{"text": textView})
}