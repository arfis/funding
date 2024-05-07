package graphqlImpl

import (
	"fmt"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/internal/services/authorization"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/arfis/crowd-funding/gateway/pkg/service"
	"github.com/graphql-go/graphql"
	"log"
)

var allocationService service.Allocation

var updateProjectInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "UpdateProjectInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"name":          &graphql.InputObjectFieldConfig{Type: graphql.String},
		"description":   &graphql.InputObjectFieldConfig{Type: graphql.String},
		"type":          &graphql.InputObjectFieldConfig{Type: graphql.String},
		"imageUrl":      &graphql.InputObjectFieldConfig{Type: graphql.String},
		"allocation":    &graphql.InputObjectFieldConfig{Type: graphql.Int},
		"startDate":     &graphql.InputObjectFieldConfig{Type: graphql.String},
		"endDate":       &graphql.InputObjectFieldConfig{Type: graphql.String},
		"minInvestment": &graphql.InputObjectFieldConfig{Type: graphql.Int},
		"maxInvestment": &graphql.InputObjectFieldConfig{Type: graphql.Int},
		"approved":      &graphql.InputObjectFieldConfig{Type: graphql.Boolean},
	},
})

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
			Type: graphql.NewNonNull(enum.InvestmentTypeEnum),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				project, ok := params.Source.(*dbModels.Project)
				if !ok {
					return nil, fmt.Errorf("unexpected source type %T", params.Source)
				}
				//return project.Type, nil
				log.Printf("GETTING TYPE %v", project.Type)
				return project.Type.String(), nil
			},
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
			Type: graphql.NewNonNull(graphql.String),
		},
		"endDate": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"minInvestment": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"maxInvestment": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"investments": &graphql.Field{
			Type: graphql.NewList(investmentType),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				project, ok := params.Source.(*dbModels.Project)
				if !ok {
					return nil, fmt.Errorf("invalid source for project investments")
				}
				return allocationService.GetInvestmentsByProjectID(project.ID)
			},
		},
		"hasPermissionToInvest": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Boolean),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				project, ok := params.Source.(*dbModels.Project)
				if !ok {
					return nil, fmt.Errorf("invalid source for quiz")
				}
				userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
				if !ok {
					return nil, fmt.Errorf("user not found")
				}
				return projectService.HasUserAccessToProject(project.Type, userDetail.UserID)
			},
		},
		"hasPermissionToEdit": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Boolean),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
				if !ok {
					return nil, fmt.Errorf("user not found")
				}
				return userDetail.Type == authorization.Admin.GetString(), nil
			},
		},
		"freeAllocation": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				project, ok := params.Source.(*dbModels.Project)
				if !ok {
					return nil, fmt.Errorf("invalid source for project investments")
				}
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

var userType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"name": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"email": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
})
