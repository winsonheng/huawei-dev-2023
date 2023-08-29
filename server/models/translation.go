package models

import (
	"errors"

	"gorm.io/gorm"
)

type Translation struct {
	gorm.Model
	SourceTextID uint `gorm:"foreignKey; not null"`
	SourceText Text
	TargetTextID uint `gorm:"foreignKey; not null"`
	TargetText Text
	ClientID uint `gorm:"foreignKey; not null"`
	Client Client
}

func (translation *Translation) ValidateEntryIsUnique(db *gorm.DB) error {
	var translations []Translation
	res := db.Where("source_text_id = ?", translation.SourceTextID).
		Where("target_text_id = ?", translation.TargetTextID).
		Where("client_id = ?", translation.ClientID).
		Find(&translations)
	if res.Error != nil {
		return res.Error
	}
	if res.RowsAffected != 0 {
		return errors.New("Duplicated translation entry")
	}
	return nil
}

func (translation *Translation) BeforeCreate(db *gorm.DB) error {
	return translation.ValidateEntryIsUnique(db)
}