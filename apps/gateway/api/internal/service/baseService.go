package service

import (
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"gorm.io/gorm"
)

type DatabaseInterface interface {
	Create(value interface{}) *gorm.DB
	// Add other necessary operations used in your service
}

var databaseConnection = database.GetConnection()
