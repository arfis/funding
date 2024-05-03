package graphqlImpl

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/arfis/crowd-funding/gateway/internal/service"
	"github.com/graphql-go/graphql"
)

var allocationService service.AllocationService
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
			Type: graphql.String, // # ISO 8601 date-time string
		},
		"endDate": &graphql.Field{
			Type: graphql.String, // # ISO 8601 date-time string
		},
		"investments": &graphql.Field{
			Type: graphql.NewList(investmentType),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				fmt.Printf("Debug: params.Source is of type %T\n", params.Source)
				// Assume project is loaded and available as part of params.Source
				project, ok := params.Source.(*database.Project)
				if !ok {
					return nil, fmt.Errorf("invalid source for project investments")
				}
				// Use the project ID to fetch related investments
				return allocationService.GetInvestmentsByProjectID(project.ID)
			},
		},
		"freeAllocation": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				fmt.Printf("Debug: params.Source is of type %T\n", params.Source)
				// Assume project is loaded and available as part of params.Source
				project, ok := params.Source.(*database.Project)
				if !ok {
					return nil, fmt.Errorf("invalid source for project investments")
				}
				// Use the project ID to fetch related investments
				return allocationService.GetFreeAllocation(project.ID)
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
