package service

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/pkg/mathUtil"
	"github.com/google/uuid"
)

type Allocation struct {
}

func (s *Allocation) GetFreeAllocation(projectId uuid.UUID) (float64, error) {
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
	result := databaseConnection.Order("created_at asc").Where("project_id = ?", projectID).Find(&investments)
	if result.Error != nil {
		return nil, result.Error
	}
	return investments, nil
}

func (s *Allocation) GetInvestmentsByProjectIDAndUser(projectID uuid.UUID, userId uuid.UUID) ([]*database.Investment, error) {
	var investments []*database.Investment

	fmt.Printf("\nGetting investment by projectID")
	// Fetch investments from the database where the 'ProjectID' field matches 'projectID'
	result := databaseConnection.Order("created_at asc").Where("project_id = ? AND user_id = ?", projectID, userId).Find(&investments)
	if result.Error != nil {
		return nil, result.Error
	}
	return investments, nil
}

func GetAvailableAllocation(projectId uuid.UUID) (float64, error) {
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

	// Assume project.Allocation is stored in smallest units with a known precision
	projectAllocation := float64(project.Allocation)
	availableAllocation := projectAllocation - totalInvestment

	return availableAllocation, nil
}

func getTotalInvested(projectId uuid.UUID) (float64, error) {
	type Result struct {
		TotalInvestment int64
		Precision       int
	}

	var result Result
	query := `
		SELECT COALESCE(SUM(amount), 0) AS total_investment, MAX(precision) as precision
		FROM investments
		WHERE project_id = $1 AND deleted_at IS NULL
		GROUP BY precision
	`

	err := databaseConnection.Raw(query, projectId).Scan(&result).Error
	if err != nil {
		return -1, err
	}

	// Convert total investment from smallest units to float with appropriate precision
	totalInvestment := mathUtil.ParseToFloat(result.TotalInvestment, result.Precision)
	return totalInvestment, nil
}
