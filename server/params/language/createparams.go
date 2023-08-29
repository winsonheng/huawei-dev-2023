package language

import "backend/models"

type CreateParams struct {
	Name string `json:"name"`
	Code string `json:"code"` // align with huawei cloud
}

func ToModel(params *CreateParams) *models.Language {
	return &models.Language{
		Name: params.Name,
		Code: params.Code,
	}
}