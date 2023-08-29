package clients

import (
	"backend/database"
	"backend/models"
)

func Create(client *models.Client) (*models.Client, error) {
	if err := database.Database.Create(&client).Error; err != nil {
		return nil, err
	}
	return client, nil
}

func List() ([]models.Client, error) {
	var clients []models.Client
	if err := database.Database.Find(&clients).Error; err != nil {
		return nil, err
	}
	return clients, nil
}