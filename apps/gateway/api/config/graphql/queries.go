package graphqlImpl

import (
	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
)

var GetRootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"getProject": &graphql.Field{
			Type: projectType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id := params.Args["id"].(string)

				if projectId, parseErr := uuid.Parse(id); parseErr == nil {
					return projectService.GetProjectByID(projectId)
				} else {
					return nil, nil
				}
			},
		},
		"getAllProjects": &graphql.Field{
			Type: graphql.NewList(projectType), // Note: Use graphql.NewList for returning a list of items
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				return projectService.ListAllProjects() // Assume this function fetches all projects
			},
		},
	},
})
