package translation

import (
	"backend/dataaccess/translations"
	"backend/params/translation"
	"backend/views/translationviews"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleListByClient(context *gin.Context) {
	var params *translation.ListParams
	if err := context.ShouldBindJSON(&params); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	translationList, err := translations.ListByClient(params.ClientID, params.TargetLanguageID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	views := translationviews.ViewsFromArray(translationList)
	
	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusCreated, gin.H{"translations": views})
}