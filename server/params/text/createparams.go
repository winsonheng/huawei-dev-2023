package text

import (
	"backend/models"
)

type CreateParams struct {
	Content    string `json:"content"`
	LanguageID uint   `json:"languageID"`
	ClientID   uint   `json:"clientID"`
}

func ToModel(params *CreateParams) (*models.Text, *models.ClientText) {
	text := models.Text{
		Content:    params.Content,
		LanguageID: params.LanguageID,
	}

	clientText := models.ClientText{
		ClientID: params.ClientID,
	}

	return &text, &clientText
}