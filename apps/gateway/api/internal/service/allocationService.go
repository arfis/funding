package service

import (
	"database/sql"
	"errors"
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/google/uuid"
)

type AllocationService struct {
}

func (s *AllocationService) GetFreeAllocation(projectId uuid.UUID) (int64, error) {
	totalInvestment, err := getAvailableAllocation(projectId)

	if err != nil {
		return -1, err
	}

	return totalInvestment, nil
}

func (s *AllocationService) GetInvestmentsByProjectID(projectID uuid.UUID) ([]*database.Investment, error) {
	var investments []*database.Investment

	fmt.Printf("\nGetting investment by projectID")
	// Fetch investments from the database where the 'ProjectID' field matches 'projectID'
	result := databaseConnection.Where("project_id = ?", projectID).Find(&investments)
	if result.Error != nil {
		return nil, result.Error
	}
	return investments, nil
}

func getTotalInvested(projectId uuid.UUID) (int64, error) {
	//project.Allocation
	var totalInvestment sql.NullInt64
	err := databaseConnection.Model(&database.Investment{}).
		Where("project_id = ?", projectId).
		Select("COALESCE(sum(amount), 0)"). // Use COALESCE to ensure zero if NULL
		Row().Scan(&totalInvestment)

	if totalInvestment.Valid == false {
		return -1, errors.New("Invalid")
	}

	if totalInvestment.Valid == false || err != nil {
		return -1, err
	}

	return totalInvestment.Int64, nil
}

func getAvailableAllocation(projectId uuid.UUID) (int64, error) {
	var project database.Project

	// Fetch total investments for the project
	totalInvestment, err := getTotalInvested(projectId)

	if err != nil {
		return 0, err
	}
	// Fetch the project to get the allocation limit
	if err := databaseConnection.First(&project, projectId).Error; err != nil {
		return 0, err
	}

	return int64(project.Allocation) - totalInvestment, nil
}

func checkAvailableInvestment(projectId uuid.UUID, investment int64) (bool, error) {
	freeAllocation, err := getAvailableAllocation(projectId)
	if err != nil {
		return false, err
	}
	// Check if adding this investment exceeds the allocation
	if freeAllocation-investment <= 0 {
		return false, errors.New("investment exceeds project allocation")
	}

	return true, nil
}
