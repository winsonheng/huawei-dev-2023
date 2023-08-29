package models

import "gorm.io/gorm"

type Language struct {
	gorm.Model
	Name string `gorm:"not null; unique"`
	Code string `gorm:"not null; unique"` // follows huawei cloud language code
	Text []Text 
}