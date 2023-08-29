package client

import "backend/models"

type CreateParams struct {
	Name string `json:"name"`
}

func ToModel(params *CreateParams) *models.Client {
	return &models.Client{
		Name: params.Name,
	}
}