package graphqlImpl

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/graphql-go/graphql"
)

var projectType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Project",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"name": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"type": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"imageUrl": &graphql.Field{
			Type: graphql.String,
		},
		"description": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"allocation": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"ownerId": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"approved": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
		"startDate": &graphql.Field{
			Type: graphql.String, // GraphQL does not have a date type by default
		},
		"endDate": &graphql.Field{
			Type: graphql.String, // Use String to represent dates
		},
		"investments": &graphql.Field{
			Type: graphql.NewList(investmentType),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				fmt.Printf("Debug: params.Source is of type %T\n", params.Source)
				// Assume project is loaded and available as part of params.Source
				project, ok := params.Source.(*database.Project)
				fmt.Printf("is OK %v\n", ok)
				if !ok {
					return nil, fmt.Errorf("invalid source for project investments")
				}
				fmt.Println("CONTINUE")
				// Use the project ID to fetch related investments
				return investmentService.GetInvestmentsByProjectID(project.ID)
			},
		},
	},
})

var investmentType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Investment",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"projectId": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"userId": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"amount": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
	},
})
