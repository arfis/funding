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
		"createProject": createProjectMutation,
		"updateProject": updateProjectMutation,
		"deleteProject": deleteProjectMutation,
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

var createProjectMutation = &graphql.Field{
	Type: projectType,
	Args: graphql.FieldConfigArgument{
		"input": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(createProjectInputType),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
		if !ok {
			return nil, fmt.Errorf("user not found")
		}

		input := params.Args["input"].(map[string]interface{})

		startDate, err := parseDate(input["startDate"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid start date format: %v", err)
		}

		endDate, err := parseDate(input["endDate"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid end date format: %v", err)
		}

		dealDate, err := parseDate(input["dealDate"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid deal date format: %v", err)
		}

		typeStr := input["type"].(string)
		investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)
		if err != nil {
			return nil, err
		}

		project := dbModels.Project{
			ID:                     uuid.New(),
			Name:                   input["name"].(string),
			Description:            input["description"].(string),
			Type:                   investmentTypeEnum,
			ImageUrl:               input["imageUrl"].(string),
			Allocation:             input["allocation"].(int),
			StartDate:              startDate,
			EndDate:                endDate,
			MinInvestment:          input["minInvestment"].(int),
			MaxInvestment:          input["maxInvestment"].(int),
			OwnerId:                &userDetail.UserID,
			Approved:               input["approved"].(bool),
			DealDate:               dealDate,
			TokenPrice:             input["tokenPrice"].(string),
			Vesting:                input["vesting"].(string),
			TotalRaisingAmount:     input["totalRaisingAmount"].(string),
			SyndicateRaisingAmount: input["syndicateRaisingAmount"].(string),
			LeadingInvestor:        input["leadingInvestor"].(string),
			Category:               input["category"].(string),
			Valuation:              input["valuation"].(string),
			Tge:                    input["tge"].(string),
			Claim:                  input["claim"].(string),
			Overview:               input["overview"].(string),
			LongDescription:        input["longDescription"].(string),
		}

		createdProject, err := projectService.CreateProject(&project)
		if err != nil {
			return nil, err
		}
		return createdProject, nil

	},
}

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
		projectID, err := uuid.Parse(params.Args["id"].(string))
		if err != nil {
			return nil, fmt.Errorf("invalid project ID")
		}

		existingProject, err := projectService.GetProjectByID(projectID)
		if err != nil {
			return nil, fmt.Errorf("project not found")
		}

		input := params.Args["input"].(map[string]interface{})

		if typeStr, ok := input["type"].(string); ok {
			investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)
			if err != nil {
				return nil, err
			}
			existingProject.Type = investmentTypeEnum
		}

		if endDateStr, ok := input["endDate"].(string); ok {
			endDate, err := parseDate(endDateStr)
			if err != nil {
				return nil, fmt.Errorf("invalid end date format: %v", err)
			}
			existingProject.EndDate = endDate
		}

		if startDateStr, ok := input["endDate"].(string); ok {
			startDate, err := parseDate(startDateStr)
			if err != nil {
				return nil, fmt.Errorf("invalid end date format: %v", err)
			}
			existingProject.StartDate = startDate
		}

		if dealDateStr, ok := input["endDate"].(string); ok {
			dealDate, err := parseDate(dealDateStr)
			if err != nil {
				return nil, fmt.Errorf("invalid end date format: %v", err)
			}
			existingProject.DealDate = dealDate
		}
		// Update project fields
		existingProject.Name = input["name"].(string)
		existingProject.Description = input["description"].(string)
		existingProject.ImageUrl = input["imageUrl"].(string)
		existingProject.Allocation = input["allocation"].(int)
		existingProject.MinInvestment = input["minInvestment"].(int)
		existingProject.MaxInvestment = input["maxInvestment"].(int)
		existingProject.Approved = input["approved"].(bool)
		existingProject.TokenPrice = input["tokenPrice"].(string)
		existingProject.Vesting = input["vesting"].(string)
		existingProject.TotalRaisingAmount = input["totalRaisingAmount"].(string)
		existingProject.SyndicateRaisingAmount = input["syndicateRaisingAmount"].(string)
		existingProject.LeadingInvestor = input["leadingInvestor"].(string)
		existingProject.Category = input["category"].(string)
		existingProject.Valuation = input["valuation"].(string)
		existingProject.Tge = input["tge"].(string)
		existingProject.Claim = input["claim"].(string)
		existingProject.Overview = input["overview"].(string)
		existingProject.LongDescription = input["longDescription"].(string)
		// Save the updated project
		if updatedProject, err := projectService.UpdateProject(existingProject); err != nil {
			return nil, err
		} else {
			return updatedProject, nil
		}
	},
}

var deleteProjectMutation = &graphql.Field{
	Type: projectType,
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.ID),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		idStr, _ := params.Args["id"].(string)
		projectID := uuid.MustParse(idStr)

		project, err := projectService.GetProjectByID(projectID)
		if err != nil {
			return nil, fmt.Errorf("project not found")
		}

		ok, deleteErr := projectService.DeleteProject(project.ID)

		if deleteErr != nil || ok == false {
			return nil, fmt.Errorf("there was a problem while deleting")
		}

		return project, nil
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
