package dbModels

import (
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Quiz struct {
	ID                     uuid.UUID           `gorm:"type:uuid;primary_key;"`
	Description            string              `gorm:"type:text;not null"`
	Type                   enum.InvestmentType `json:"type" gorm:"not null;type:int;unique"` // type of quiz - so he can do crypto investments, classical, fonds, etc
	Questions              []QuizQuestion      `gorm:"foreignKey:QuizID"`
	UserID                 uuid.UUID           `gorm:"type:uuid;not null"`
	MinimalPointsToSuccess int                 `gorm:"type:int"`
}

type QuizQuestion struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;"`
	Description string    `gorm:"type:text;not null"`
	AnswerType  string    `gorm:"type:varchar(100);not null"`
	Answers     []Answer  `gorm:"foreignKey:QuizQuestionID"`
	QuizID      uuid.UUID `gorm:"type:uuid;not null;foreignKey"`
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
