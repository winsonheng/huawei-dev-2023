package models

import "gorm.io/gorm"

type Client struct {
	gorm.Model
	Name string `gorm:"not null; unique"`
	Translations []Translation
}