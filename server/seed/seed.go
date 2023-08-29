package seed

import (
	"backend/dataaccess/clients"
	"backend/dataaccess/languages"
	"backend/dataaccess/translations"
	"backend/database"
	"backend/models"

	"gorm.io/gorm"
)

// TODO: seed using proper sql seed file
func SeedDB() {
	db := database.Database
	seedLanguages(db)
	seedClients(db)
	seedTranslations(db)
}

func seedLanguages(db *gorm.DB) {
	languages.Create(&models.Language{Name: "english", Code: "en"})
	languages.Create(&models.Language{Name: "spanish", Code: "es"})
}

func seedClients(db *gorm.DB) {
	clients.Create(&models.Client{Name: "client1"})
	clients.Create(&models.Client{Name: "client2"})
}

func seedTranslations(db *gorm.DB) {
	translations.Create(
		&models.Text{Content: "happy", LanguageID: 1},
		&models.Text{Content: "feliz", LanguageID: 2},
		1,
	)

	translations.Create(
		&models.Text{Content: "i am happy", LanguageID: 1},
		&models.Text{Content: "yo estoy feliz", LanguageID: 2},
		1,
	)
}