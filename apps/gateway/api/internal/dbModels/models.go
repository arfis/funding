package dbModels

import (
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Project struct {
	ID            uuid.UUID           `json:"id" gorm:"type:uuid;primary_key;"`
	Name          string              `json:"name" gorm:"not null;type:varchar(100)"`     // Explicit type and constraint
	Type          enum.InvestmentType `json:"type" gorm:"not null;type:int"`              // Explicit type and constraint crypto investments, classical, fonds, etc
	ImageUrl      string              `json:"imageUrl" gorm:"type:text"`                  // Handles URLs which can be long
	Description   string              `json:"description" gorm:"type:text"`               // Handles potentially long descriptions
	Allocation    int                 `json:"allocation" gorm:"not null;type:int"`        // Explicit type for financial data
	MinInvestment int                 `json:"minInvestment" gorm:"type:int"`              // Explicit type for financial data
	MaxInvestment int                 `json:"maxInvestment" gorm:"type:int"`              // Explicit type for financial data
	OwnerId       *uuid.UUID          `json:"ownerId" gorm:"type:uuid;not null;index"`    // Indexed for faster lookups on owner
	Approved      bool                `json:"approved" gorm:"type:boolean;default:false"` // Default value
	StartDate     time.Time           `json:"startDate" gorm:"type:date"`                 // Date without time
	EndDate       time.Time           `json:"endDate" gorm:"type:date"`                   // Date without time
	Investments   *[]Investment       `json:"investments" gorm:"foreignKey:ProjectID"`    // Relationship definition
}

type Investment struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;"`
	ProjectID   uuid.UUID      `json:"projectId" gorm:"type:uuid;not null;index"` // Indexed for performance
	UserID      uuid.UUID      `json:"userId" gorm:"type:uuid;not null;index"`    // Indexed for performance
	Amount      int            `json:"amount" gorm:"not null;type:int"`           // Precision for financial data
	Approved    bool           `json:"approved" gorm:"type: boolean;default:false"`
	LockedUntil *time.Time     `json:"lockedUntil" gorm:"type:timestamp"`
	Project     Project        `json:"project" gorm:"foreignKey:ProjectID"` // Navigation property
	DeletedAt   gorm.DeletedAt `gorm:"index"`                               // This enables soft deletes
}

func (base *Project) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

type UserError struct {
	Message string
}
