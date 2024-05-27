package dbModels

import (
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Project struct {
	ID                     uuid.UUID           `json:"id" gorm:"type:uuid;primary_key;"`
	Name                   string              `json:"name" gorm:"not null;type:varchar(100)"`
	Type                   enum.InvestmentType `json:"type" gorm:"not null;type:int"`
	ImageUrl               string              `json:"imageUrl" gorm:"type:text"`
	Description            string              `json:"description" gorm:"type:text"`
	Allocation             int                 `json:"allocation" gorm:"not null;type:int"`
	MinInvestment          int                 `json:"minInvestment" gorm:"type:int"`
	MaxInvestment          int                 `json:"maxInvestment" gorm:"type:int"`
	OwnerId                *uuid.UUID          `json:"ownerId" gorm:"type:uuid;not null;index"`
	Approved               bool                `json:"approved" gorm:"type:boolean;default:false"`
	StartDate              time.Time           `json:"startDate" gorm:"type:date"`
	EndDate                time.Time           `json:"endDate" gorm:"type:date"`
	CreatedAt              time.Time           `gorm:"autoCreateTime"`
	Investments            *[]Investment       `json:"investments" gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE"`
	DealDate               time.Time           `json:"dealDate" gorm:"type:date"`
	TokenPrice             string              `json:"tokenPrice" gorm:"type:text"`
	Vesting                string              `json:"vesting" gorm:"type:text"`
	TotalRaisingAmount     string              `json:"totalRaisingAmount" gorm:"type:text"`
	SyndicateRaisingAmount string              `json:"syndicateRaisingAmount" gorm:"type:text"`
	LeadingInvestor        string              `json:"leadingInvestor" gorm:"type:text"`
	Category               string              `json:"category" gorm:"type:text"`
	Valuation              string              `json:"valuation" gorm:"type:text"`
	Tge                    string              `json:"tge" gorm:"type:text"`
	Claim                  string              `json:"claim" gorm:"type:text"`
	Overview               string              `json:"overview" gorm:"type:text"`
	LongDescription        string              `json:"longDescription" gorm:"type:text"`
}

type Investment struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;"`
	ProjectID   uuid.UUID      `json:"projectId" gorm:"type:uuid;not null;index"` // Indexed for performance
	UserID      uuid.UUID      `json:"userId" gorm:"type:uuid;not null;index"`    // Indexed for performance
	Amount      int            `json:"amount" gorm:"not null;type:int"`           // Precision for financial data
	Approved    bool           `json:"approved" gorm:"type: boolean;default:false"`
	LockedUntil *time.Time     `json:"lockedUntil" gorm:"type:timestamp"`
	Project     Project        `json:"project" gorm:"foreignKey:ProjectID;constraint:OnDelete:CASCADE;"` // Navigation property
	DeletedAt   gorm.DeletedAt `gorm:"index"`                                                            // This enables soft deletes
}

func (base *Project) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

type UserError struct {
	Message string
}
