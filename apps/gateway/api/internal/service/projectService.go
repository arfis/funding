package service

import (
	database "crowd-funding/api/internal/db"
	"github.com/google/uuid"
)

var databaseConnection = database.GetConnection()

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

func (projectService *ProjectService) ListAllProjects() ([]database.Project, error) {
	var projects []database.Project
	err := databaseConnection.Find(&projects).Error
	if err != nil {
		return nil, err
	}
	return projects, nil
}

func (ProjectService *ProjectService) UpdateProject(id uuid.UUID, updatedProject *database.Project) (*database.Project, error) {
	var project database.Project
	databaseConnection.First(&project, "id = ?", id)

	// Update fields that are provided

	project.Name = updatedProject.Name
	// Repeat for other fields...

	err := databaseConnection.Save(&project).Error
	if err != nil {
		return nil, err
	}

	return &project, nil
}
