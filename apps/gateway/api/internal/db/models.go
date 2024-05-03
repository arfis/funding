package database

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
	"time"
)

type Project struct {
	ID          uuid.UUID     `json:"id" gorm:"type:uuid;primary_key;"`
	Name        string        `json:"name" gorm:"not null;type:varchar(100)"`        // Explicit type and constraint
	Type        string        `json:"type" gorm:"not null;type:varchar(100)"`        // Explicit type and constraint
	ImageUrl    string        `json:"imageUrl" gorm:"type:text"`                     // Handles URLs which can be long
	Description string        `json:"description" gorm:"type:text"`                  // Handles potentially long descriptions
	Allocation  float64       `json:"allocation" gorm:"not null;type:decimal(10,2)"` // Explicit type for financial data
	OwnerId     *uuid.UUID    `json:"ownerId" gorm:"type:uuid;not null;index"`       // Indexed for faster lookups on owner
	Approved    bool          `json:"approved" gorm:"type:boolean;default:false"`    // Default value
	StartDate   time.Time     `json:"startDate" gorm:"type:date"`                    // Date without time
	EndDate     time.Time     `json:"endDate" gorm:"type:date"`                      // Date without time
	Investments *[]Investment `json:"investments" gorm:"foreignKey:ProjectID"`       // Relationship definition
}

type Investment struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;primary_key;"`
	ProjectID uuid.UUID `json:"projectId" gorm:"type:uuid;not null;index"` // Indexed for performance
	UserID    uuid.UUID `json:"userId" gorm:"type:uuid;not null;index"`    // Indexed for performance
	Amount    float64   `json:"amount" gorm:"not null;type:decimal(10,2)"` // Precision for financial data
	Project   Project   `json:"project" gorm:"foreignKey:ProjectID"`       // Navigation property
}

type QuizQuestion struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;"`
	Description string    `gorm:"type:text;not null"`
	Type        string    `gorm:"type:varchar(100);not null"`
	AnswerType  string    `gorm:"type:varchar(100);not null"`
	Answers     []Answer  `gorm:"foreignKey:QuizQuestionID"`
}

// Answer represents the answer to a quiz question
type Answer struct {
	ID             uuid.UUID `gorm:"type:uuid;primary_key;"`
	QuizQuestionID uuid.UUID `gorm:"type:uuid;not null"`
	Description    string    `gorm:"type:text;not null"`
	IsRight        bool      `gorm:"type:boolean;not null"`
}

// QuizTake represents a user's attempt at taking a quiz
type QuizTake struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;"`
	QuizID       uuid.UUID `gorm:"type:uuid;not null"`
	UserID       uuid.UUID `gorm:"type:uuid;not null"`
	Successness  bool      `gorm:"type:boolean"`
	PointsScored int       `gorm:"type:int"`
}

func (base *Project) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

func (base *QuizQuestion) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

func (base *Answer) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

func (base *QuizTake) BeforeCreate(tx *gorm.DB) (err error) {
	base.ID = uuid.New()
	return
}

type UserError struct {
	Message string
}
