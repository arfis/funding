package graphqlImpl

import (
	database "crowd-funding/api/internal/db"
	"crowd-funding/api/internal/service"
	"fmt"
	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
	"net/http"
	"time"
)

var invoiceService service.ProjectService

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
					Type: graphql.Float,
				},
				"startDate": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				"endDate": &graphql.ArgumentConfig{
					Type: graphql.String,
				},
				// Add other fields similarly
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {

				headers, headersOk := params.Context.Value("headers").(http.Header)

				fmt.Printf("\n The headers are %v %v", headers, headersOk)
				startDate, err := time.Parse(time.RFC3339, params.Args["startDate"].(string))
				if err != nil {
					return nil, err // Return or handle error appropriately if parsing fails
				}

				endDate, err := time.Parse(time.RFC3339, params.Args["endDate"].(string))
				if err != nil {
					return nil, err // Return or handle error appropriately if parsing fails
				}

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
					Allocation:  params.Args["allocation"].(float64),
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
				"allocation":  &graphql.ArgumentConfig{Type: graphql.Float},
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

				if name, ok := params.Args["name"].(string); ok {
					project.Name = name
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
	},
})
