package database

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a user of the application
type User struct {
	ID           *uuid.UUID `gorm:"type:uuid;primary_key;"`
	Username     string    `gorm:"type:varchar(100);not null;unique"`
	Email        string    `gorm:"type:varchar(100);not null;unique"`
	PasswordHash string    `gorm:"type:text;not null"`
}

func (base *User) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

type UserError struct {
	Message string
}

func CreateUser(user User) (User, error) {
	result := GetConnection().Create(&user)
	if result.Error != nil {
		return nil, &UserError{Message: "Db connection failed"}
	}

	return &user, nil
}
