package service

import (
	"database/sql"
	"errors"
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/google/uuid"
)

type Allocation struct {
}

func (s *Allocation) GetFreeAllocation(projectId uuid.UUID) (int64, error) {
	freeAllocation, err := GetAvailableAllocation(projectId)

	if err != nil {
		return -1, err
	}

	return freeAllocation, nil
}

func (s *Allocation) GetInvestmentsByProjectID(projectID uuid.UUID) ([]*database.Investment, error) {
	var investments []*database.Investment

	fmt.Printf("\nGetting investment by projectID")
	// Fetch investments from the database where the 'ProjectID' field matches 'projectID'
	result := databaseConnection.Where("project_id = ?", projectID).Find(&investments)
	if result.Error != nil {
		return nil, result.Error
	}
	return investments, nil
}

func GetAvailableAllocation(projectId uuid.UUID) (int64, error) {
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

func getTotalInvested(projectId uuid.UUID) (int64, error) {
	//project.Allocation
	var totalInvestment sql.NullInt64
	err := databaseConnection.Model(&database.Investment{}).
		Where("project_id = ? AND deleted_at is null", projectId).
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
