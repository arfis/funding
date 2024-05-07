package graphqlImpl

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/internal/services/authorization"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/arfis/crowd-funding/gateway/pkg/service"
	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
	"log"
	"time"
)

var (
	projectService service.ProjectService
	quizService    service.QuizService
)

var GetRootMutation = graphql.NewObject(graphql.ObjectConfig{
	Name: "Mutation",
	Fields: graphql.Fields{
		"createProject": &graphql.Field{
			Type: projectType,
			Args: graphql.FieldConfigArgument{
				"name": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"description": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"type": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"imageUrl": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"allocation": &graphql.ArgumentConfig{
					Type: graphql.Int,
				},
				"startDate": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"endDate": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"minInvestment": &graphql.ArgumentConfig{
					Type: graphql.Int,
				},
				"maxInvestment": &graphql.ArgumentConfig{
					Type: graphql.Int,
				},
				"approved": &graphql.ArgumentConfig{
					Type: graphql.Boolean,
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
				if !ok {
					return nil, fmt.Errorf("user not found")
				}

				startDate, err := parseDate(params.Args["startDate"].(string))
				endDate, err := parseDate(params.Args["startDate"].(string))
				if err != nil {
					return nil, err
				}
				var approved bool
				if approvedArg, ok := params.Args["approved"]; ok {
					approvedValue, ok := approvedArg.(bool)
					if !ok {
						return nil, fmt.Errorf("approved must be a boolean")
					}
					approved = approvedValue
				} else {
					approved = false
				}

				typeStr := params.Args["type"].(string)
				investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)

				if err != nil {
					return nil, err
				}

				imageUrl, _ := params.Args["imageUrl"].(string)
				allocation, _ := params.Args["allocation"].(int)
				minInvestment, _ := params.Args["minInvestment"].(int)
				maxInvestment, _ := params.Args["maxInvestment"].(int)

				project := dbModels.Project{
					ID:            uuid.New(),
					Name:          params.Args["name"].(string),
					Type:          investmentTypeEnum,
					ImageUrl:      imageUrl,
					Description:   params.Args["description"].(string),
					Allocation:    allocation,
					OwnerId:       &userDetail.UserID,
					Approved:      approved,
					StartDate:     startDate,
					EndDate:       endDate,
					MaxInvestment: maxInvestment,
					MinInvestment: minInvestment,
				}

				createdProject, err := projectService.CreateProject(&project)
				if err != nil {
					return nil, err
				}
				return createdProject, nil
			},
		},
		"updateProject": updateProjectMutation,
		"deleteProject": &graphql.Field{
			Type: projectType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id := params.Args["id"].(uuid.UUID)
				return projectService.DeleteProject(id)
			},
		},
		"createInvestment": &graphql.Field{
			Type: investmentType,
			Args: graphql.FieldConfigArgument{
				"projectId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"amount": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
				if !ok {
					log.Println("UserID not found or is not of type uuid.UUID")
					return nil, fmt.Errorf("user not found")
				}
				projectId, _ := uuid.Parse(params.Args["projectId"].(string))
				amount := params.Args["amount"].(int)
				project, err := projectService.GetProjectByID(projectId)
				if err != nil {
					return nil, fmt.Errorf("project not found")
				}
				if !project.Approved {
					return nil, fmt.Errorf("project not approved for investments")
				}
				userInvestment := dbModels.Investment{
					ID:        uuid.New(),
					ProjectID: projectId,
					UserID:    userDetail.UserID,
					Amount:    amount,
				}
				investmentService := service.NewInvestmentService(database.GetConnection())
				createdInvestment, err := investmentService.CreateInvestment(&userInvestment)
				if err != nil {
					return nil, fmt.Errorf(err.Error())
				}
				return createdInvestment, nil
			},
		},
		"createQuiz":       createQuizMutation,
		"submitQuizAnswer": submitQuizAnswerMutation,
		"updateQuiz":       updateQuizMutation,
	},
})

var updateProjectMutation = &graphql.Field{
	Type: projectType,
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"input": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(updateProjectInputType),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		//userID, ok := params.Context.Value("userID").(*uuid.UUID)
		//if !ok {
		//	return nil, fmt.Errorf("user not found")
		//}

		// Fetch the project by ID
		projectID, err := uuid.Parse(params.Args["id"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid project ID")
		}

		existingProject, err := projectService.GetProjectByID(projectID)
		if err != nil {
			return nil, fmt.Errorf("project not found")
		}

		input := params.Args["input"].(map[string]interface{})

		// Update project fields
		if name, ok := input["name"].(string); ok {
			existingProject.Name = name
		}
		if description, ok := input["description"].(string); ok {
			existingProject.Description = description
		}
		if typeStr, ok := input["type"].(string); ok {
			investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)
			if err != nil {
				return nil, err
			}
			existingProject.Type = investmentTypeEnum
		}
		if imageUrl, ok := input["imageUrl"].(string); ok {
			existingProject.ImageUrl = imageUrl
		}
		if allocation, ok := input["allocation"].(int); ok {
			existingProject.Allocation = allocation
		}
		if startDateStr, ok := input["startDate"].(string); ok {
			startDate, err := parseDate(startDateStr)
			if err != nil {
				return nil, fmt.Errorf("invalid start date format: %v", err)
			}
			existingProject.StartDate = startDate
		}
		if endDateStr, ok := input["endDate"].(string); ok {
			endDate, err := parseDate(endDateStr)
			if err != nil {
				return nil, fmt.Errorf("invalid end date format: %v", err)
			}
			existingProject.EndDate = endDate
		}
		if minInvestment, ok := input["minInvestment"].(int); ok {
			existingProject.MinInvestment = minInvestment
		}
		if maxInvestment, ok := input["maxInvestment"].(int); ok {
			existingProject.MaxInvestment = maxInvestment
		}
		if approvedArg, ok := input["approved"]; ok {
			approvedValue, ok := approvedArg.(bool)
			if !ok {
				return nil, fmt.Errorf("approved must be a boolean")
			}
			existingProject.Approved = approvedValue
		}

		// Ensure the ownerId is not changed
		existingProject.OwnerId = existingProject.OwnerId

		// Save the updated project
		updatedProject, err := projectService.UpdateProject(existingProject)
		if err != nil {
			return nil, err
		}

		return updatedProject, nil
	},
}

func parseDate(dateStr string) (time.Time, error) {
	dateFormats := []string{
		time.RFC3339,             // "2006-01-02T15:04:05Z07:00"
		"2006-01-02T15:04",       // "2006-01-02T15:04"
		"2006-01-02T15:04-07:00", // "2006-01-02T15:04-07:00"
	}

	for _, format := range dateFormats {
		if date, err := time.Parse(format, dateStr); err == nil {
			return date, nil
		}
	}

	return time.Time{}, fmt.Errorf("invalid date format")
}
