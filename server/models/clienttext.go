package models

import (
	"errors"

	"gorm.io/gorm"
)

type ClientText struct {
	gorm.Model
	ClientID uint `gorm:"foreignKey; not null"`
	Client Client
	TextID uint `gorm:"foreignKey; not null"`
	Text Text
}

func (clientText *ClientText) ValidateEntryIsUnique(db *gorm.DB) error {
	var clientTexts []ClientText
	res := db.Where("client_id = ?", clientText.ClientID).
		Where("text_id = ?", clientText.TextID).
		Find(&clientTexts)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected != 0 {
		return errors.New("Duplicated clientText entry")
	}
	return nil
}

func (clientText *ClientText) BeforeCreate(db *gorm.DB) error {
	return clientText.ValidateEntryIsUnique(db)
}