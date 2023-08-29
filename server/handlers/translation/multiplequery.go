package translation

import (
	"backend/dataaccess/translations"
	"backend/models"
	"backend/params/translation"
	"backend/views/textviews"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleMultipleQuery(context *gin.Context) {
	var params *translation.MultipleQueryParams
	if err := context.ShouldBindJSON(&params); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	translationsList := make([]*models.Text, len(params.Queries)) 
	for i, query := range params.Queries {
		translation, err := translations.Query(int64(params.SourceLanguageID), int64(params.TargetLanguageID), int64(params.ClientID), query)

		if err == nil {
			translationsList[i] = translation
			continue
		}

		translation, _ = getTranslationFromHuaweiCloud(query, int64(params.SourceLanguageID), int64(params.TargetLanguageID))

		translationsList[i] = translation
	}

	translationViews := textviews.ViewsFromPointerArray(translationsList)

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusCreated, gin.H{"translations": translationViews})
}