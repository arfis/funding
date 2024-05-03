package service

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/google/uuid"
)

type InvestmentService struct{}

func (s *InvestmentService) CreateInvestment(investment *database.Investment) (*database.Investment, error) {
	// Add business logic here, e.g., checking if the investment exceeds available slots, etc.
	// Then, save to database
	result := databaseConnection.Create(investment)
	if result.Error != nil {
		return nil, result.Error
	}
	return investment, nil
}

func (s *InvestmentService) GetInvestmentsByProjectID(projectID uuid.UUID) ([]*database.Investment, error) {
	var investments []*database.Investment

	fmt.Printf("\nGetting investment by projectID")
	// Fetch investments from the database where the 'ProjectID' field matches 'projectID'
	result := databaseConnection.Where("project_id = ?", projectID).Find(&investments)
	if result.Error != nil {
		return nil, result.Error
	}
	return investments, nil
}
