package database

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a user of the application
type User struct {
	ID            uuid.UUID       `gorm:"type:uuid;primary_key;"`
	ExternalID    string          `gorm:"type:varchar(100);not null;unique"` // ID provided by the third-party service
	Username      string          `gorm:"type:varchar(100);"`
	Email         string          `gorm:"type:varchar(100);not null;unique"`
	AvatarURL     string          `gorm:"type:varchar(100)"` // URL to the user's avatar picture
	Provider      string          `gorm:"type:varchar(100)"` // Name of the third-party provider, e.g., "Google", "Facebook"
	PasswordHash  string          `gorm:"type:text;not null"`
	Type          string          `gorm:"type:text;default:ONBOARDED"`
	WalletAddress string          `gorm:"type:varchar(100);"`
	DeletedAt     *gorm.DeletedAt `gorm:"index"` // This enables soft deletes
}

func (base *User) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}
