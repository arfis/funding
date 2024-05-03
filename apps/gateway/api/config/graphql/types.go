package graphqlImpl

import (
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
			Type: graphql.NewNonNull(graphql.Float),
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
			Type: graphql.NewNonNull(graphql.Float),
		},
	},
})
