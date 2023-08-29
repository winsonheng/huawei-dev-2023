package translation

import "backend/models"

type singleParam struct {
	SourceTextContent     string `json:"text"`
	SourceLanguageID      uint `json:"sourceLanguageID"`
	TranslatedTextContent string `json:"translation"`
	TranslatedLanguageID  uint `json:"targetLanguageID"`
	ClientID              uint   `json:"clientID"`
}

type CreateParams struct {
	Translations []singleParam `json:"translations"`
}

func ToModel(params *CreateParams) ([]models.Text, []models.Text, []uint) {
	sourceTexts := make([]models.Text, len(params.Translations))
	translatedTexts := make([]models.Text, len(params.Translations))
	clientIDs := make([]uint, len(params.Translations))
	for i, param := range params.Translations {
		sourceText := models.Text{
			Content: param.SourceTextContent,
			LanguageID: param.SourceLanguageID,
		}
		sourceTexts[i] = sourceText
	
		translatedText := models.Text{
			Content: param.TranslatedTextContent,
			LanguageID: param.TranslatedLanguageID,
		}
		translatedTexts[i] = translatedText

		clientIDs[i] = param.ClientID
	}
	

	return sourceTexts, translatedTexts, clientIDs
}