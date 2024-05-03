package graphqlImpl

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/arfis/crowd-funding/gateway/internal/service"
	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
	"net/http"
	"time"
)

var (
	projectService service.ProjectService
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
				"approved": &graphql.ArgumentConfig{
					Type: graphql.Boolean,
				},
				// Add other fields similarly
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {

				headers, headersOk := params.Context.Value("headers").(http.Header)

				fmt.Printf("\n The headers are %v %v", headers, headersOk)
				// When parsing a string to time.Time
				startDate, err := time.Parse(time.RFC3339, params.Args["startDate"].(string))
				endDate, err := time.Parse(time.RFC3339, params.Args["startDate"].(string))

				//// When sending time.Time to the client
				//startDateString := startDate.Format(time.RFC3339)
				//endDateString := endDate.Format(time.RFC3339)

				var (
					ownerId  uuid.UUID
					parseErr error
				)
				ownerIdString := "abb55e3c-8903-467c-ac27-b240de5aafed"
				if params.Args["ownerId"] != nil {
					ownerId, parseErr = uuid.Parse(params.Args["ownerId"].(string))
				} else {
					ownerId, parseErr = uuid.Parse(ownerIdString)
				}

				if parseErr != nil {
					fmt.Printf("\n There was an error parsing")
				}

				var approved bool
				if approvedArg, ok := params.Args["approved"]; ok {
					// Now, check if it's of the type you expect
					approvedValue, ok := approvedArg.(bool)
					if !ok {
						return nil, fmt.Errorf("approved must be a boolean")
					}
					approved = approvedValue
				} else {
					// Set a default value or handle the missing value
					approved = false // Default to false, or handle as appropriate
				}

				project := database.Project{
					ID:          uuid.New(), // Generate a new UUID
					Name:        params.Args["name"].(string),
					Type:        params.Args["type"].(string),
					ImageUrl:    params.Args["imageUrl"].(string),
					Description: params.Args["description"].(string),
					Allocation:  params.Args["allocation"].(int),
					OwnerId:     &ownerId,
					Approved:    approved,
					StartDate:   startDate,
					EndDate:     endDate,
				}
				createdProject, err := projectService.CreateProject(&project)
				if err != nil {
					return nil, err

				}
				return createdProject, nil
			},
		},
		"updateProject": &graphql.Field{
			Type: projectType,
			Args: graphql.FieldConfigArgument{
				"id":          &graphql.ArgumentConfig{Type: graphql.NewNonNull(graphql.ID)},
				"name":        &graphql.ArgumentConfig{Type: graphql.String},
				"type":        &graphql.ArgumentConfig{Type: graphql.String},
				"imageUrl":    &graphql.ArgumentConfig{Type: graphql.String},
				"description": &graphql.ArgumentConfig{Type: graphql.String},
				"allocation":  &graphql.ArgumentConfig{Type: graphql.Int},
				"ownerId":     &graphql.ArgumentConfig{Type: graphql.ID},
				"approved":    &graphql.ArgumentConfig{Type: graphql.Boolean},
				"startDate":   &graphql.ArgumentConfig{Type: graphql.String},
				"endDate":     &graphql.ArgumentConfig{Type: graphql.String},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				var project database.Project
				id := uuid.MustParse(params.Args["id"].(string))

				// Update fields that are provided
				if name, ok := params.Args["name"].(string); ok {
					project.Name = name
				}

				if approved, ok := params.Args["approved"].(bool); ok {
					project.Approved = approved
				}
				// Repeat for other fields...

				return projectService.UpdateProject(id, &project)
			},
		},
		"deleteProject": &graphql.Field{
			Type: projectType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id := params.Args["id"].(uuid.UUID)
				// Assume GetProjectByID fetches a project by its UUID
				return projectService.DeleteProject(id)
			},
		},
		"createInvestment": &graphql.Field{
			Type: investmentType, // Assuming you have defined this type similar to projectType
			Args: graphql.FieldConfigArgument{
				"projectId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"userId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
				"amount": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				projectId, _ := uuid.Parse(params.Args["projectId"].(string))
				userId, _ := uuid.Parse(params.Args["userId"].(string))
				amount := params.Args["amount"].(int)

				// Validate project exists and can receive investments
				project, err := projectService.GetProjectByID(projectId)
				if err != nil {
					return nil, fmt.Errorf("project not found")
				}
				if !project.Approved {
					return nil, fmt.Errorf("project not approved for investments")
				}

				// Create and save the new investment
				investment := database.Investment{
					ID:        uuid.New(),
					ProjectID: projectId,
					UserID:    userId,
					Amount:    amount,
				}

				investmentService := service.NewInvestmentService(database.GetConnection())
				createdInvestment, err := investmentService.CreateInvestment(&investment)

				if err != nil {
					return nil, fmt.Errorf(err.Error())
				}

				return createdInvestment, nil
			},
		},
	},
})
