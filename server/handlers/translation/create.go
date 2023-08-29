package translation

import (
	"backend/dataaccess/translations"
	"backend/models"
	"backend/params/translation"
	"net/http"

	"github.com/gin-gonic/gin"
)

func HandleCreate(context *gin.Context) {
	var createParams translation.CreateParams

	if err := context.ShouldBindJSON(&createParams); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sourceTexts, translatedTexts, clientIDs := translation.ToModel(&createParams)

	translationList := make([]*models.Translation, len(sourceTexts))

	for i := range sourceTexts {
		translation, err := translations.Create(&sourceTexts[i], &translatedTexts[i], clientIDs[i])

		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		translationList[i] = translation
	}

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusCreated, gin.H{"translations": translationList})
}