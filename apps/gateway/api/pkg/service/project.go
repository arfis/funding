package service

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"log"
)

type ProjectService struct{}

func (projectService *ProjectService) CreateProject(project *database.Project) (*database.Project, error) {
	err := databaseConnection.Create(&project).Error
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (projectService *ProjectService) GetProjectByID(id uuid.UUID) (*database.Project, error) {
	var project database.Project
	fmt.Printf("\nFinding project %d", id)
	err := databaseConnection.First(&project, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (projectService *ProjectService) DeleteProject(id uuid.UUID) (bool, error) {
	err := databaseConnection.Delete(&database.Project{}, "id = ?", id).Error
	return true, err
}

func (projectService *ProjectService) ListAllApprovedProjects() ([]*database.Project, error) {
	var projects []*database.Project
	// todo: for now filtering out unknown
	err := databaseConnection.Order("created_at desc").Where("type != ? AND approved = true", enum.Unknown).Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (projectService *ProjectService) ListAllProjects() ([]*database.Project, error) {
	var projects []*database.Project
	// todo: for now filtering out unknown
	err := databaseConnection.Order("created_at desc").Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (projectService *ProjectService) ListAllForUser(userID *uuid.UUID) ([]*database.Project, error) {
	var projects []*database.Project

	// Subquery to get quiz types that the user has successfully completed
	subQuery := databaseConnection.Table("quiz_takes").
		Select("quizzes.type").
		Joins("JOIN quizzes ON quizzes.id = quiz_takes.quiz_id").
		Where("quiz_takes.user_id = ? AND quiz_takes.successness = true", userID).
		Group("quizzes.type")

	// Main query to get projects based on the subquery result
	err := databaseConnection.Preload("Investments").
		Where("type IN (?)", subQuery).
		Find(&projects).Error

	if err != nil {
		log.Println("GOT ERROOOOOOOR")
		return nil, err
	}
	log.Println("NO NON ONO ERROOOOOOOR")
	return projects, nil
}

func (projectService *ProjectService) HasUserAccessToProject(projectType enum.InvestmentType, userID uuid.UUID) (bool, error) {
	var count int64

	// Query to check if the user has successfully completed a quiz of the specified type
	err := databaseConnection.Table("quiz_takes").
		Joins("JOIN quizzes ON quizzes.id = quiz_takes.quiz_id").
		Where("quiz_takes.user_id = ? AND quiz_takes.successness = true AND quizzes.type = ?", userID, projectType).
		Count(&count).Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (ProjectService *ProjectService) UpdateProject(updatedProject *database.Project) (*database.Project, error) {
	err := databaseConnection.Save(updatedProject).Error
	if err != nil {
		return nil, err
	}
	return updatedProject, nil
}
