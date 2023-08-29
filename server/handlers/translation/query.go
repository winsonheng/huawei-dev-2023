package translation

import (
	"backend/dataaccess/languages"
	"backend/dataaccess/translations"
	"backend/models"
	"backend/utils"
	"backend/views/textviews"
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func HandleQuery(context *gin.Context) {
	// retrieve query params
	// url should be translations?from={languageID}&to={languageID}&client={clientID}&q={i+want+to+query+something}
	sourceLanguageID, err := strconv.ParseInt(context.Query("from"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	targetLanguageID, err :=  strconv.ParseInt(context.Query("to"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	clientID, err :=  strconv.ParseInt(context.Query("client"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	query := context.Query("q")
	text := strings.Join(strings.Split(query, "+"), " ")

	translation, err := translations.Query(sourceLanguageID, targetLanguageID, clientID, text)

	if err != nil {
		// context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		translation, err := getTranslationFromHuaweiCloud(text, sourceLanguageID, targetLanguageID)
		if err != nil {
			context.JSON(http.StatusBadRequest, gin.H{"error": "unable to retrieve translation"})
		} else {
			context.JSON(http.StatusOK, gin.H{"translation": textviews.ViewFrom(translation)})
		}
		return
	}

	translationView := textviews.ViewFrom(translation)

	context.Header("Access-Control-Allow-Origin", "*")
	context.JSON(http.StatusOK, gin.H{"translation": translationView})
}

type TranslationRequestParameters struct {
	Text string `json:"text"`
	From string `json:"from"`
	To string `json:"to"`
}

// makes a api call to retrieve translation from huawei cloud
func getTranslationFromHuaweiCloud(text string, sourceLanguageID int64, targetLanguageID int64) (*models.Text, error) {
	apiUrl := "https://nlp-ext." + os.Getenv("PROJECT_NAME") + ".myhuaweicloud.com/v1/" + os.Getenv("PROJECT_ID") + "/machine-translation/text-translation"

	// TODO: cache token
	token, err := utils.GetAccessToken()
	if err != nil {
		return nil, err
	}

	from, err := languages.GetLanguageFromID(sourceLanguageID)
	if err != nil {
		return nil, err
	}

	to, err := languages.GetLanguageFromID(targetLanguageID)
	if err != nil {
		return nil, err
	}
	
	requestParameters := TranslationRequestParameters{
		Text: text,
		From: from.Code,
		To: to.Code,
	}
	marshalled, err := json.Marshal(requestParameters)

	if err != nil {
		return nil, err
	}

	// create new http request
	request, err := http.NewRequest("POST", apiUrl, bytes.NewReader(marshalled))
	request.Header.Set("Content-Type", "application/json; charset=utf-8")
	request.Header.Set("X-Auth-Token", *token)

	if err != nil {
		return nil, err
	}

	// send request
	client := &http.Client{Timeout: 10 * time.Second}
    response, err := client.Do(request)

	if err != nil {
		return nil, err
	}

	translationContent, err := getTranslationFromRequest(response)

	if err != nil {
		return nil, err
	}

	translation := models.Text{
		Content: *translationContent,
		LanguageID: to.ID,
	}

	return &translation, nil
}

type Body struct {
	SrcText string `json:"src_text"`
	TranslatedText string `json:"translated_text"`
	From string `json:"from"`
	To string `json:"to"`
}

// extracts translation from api response
func getTranslationFromRequest(response *http.Response) (*string, error) {
	var body Body
    err := json.NewDecoder(response.Body).Decode(&body)
	if err != nil {
		return nil, err
	}

    return &body.TranslatedText, nil
}