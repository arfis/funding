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
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"description": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"type": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"imageUrl": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"allocation": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"startDate": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"endDate": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"minInvestment": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"minInvestmentPrecision": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"maxInvestment": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"approved": &graphql.InputObjectFieldConfig{
			Type: graphql.Boolean,
		},
		"dealDate": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"tokenPrice": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"vesting": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"totalRaisingAmount": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"syndicateRaisingAmount": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"leadingInvestor": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"category": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"valuation": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"tge": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"claim": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"overview": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"longDescription": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"ethAddress": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
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
		"ethAddress": &graphql.Field{
			Type: graphql.String,
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
		"startDate": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"endDate": &graphql.Field{
			Type: graphql.String,
		},
		"ownerId": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"approved": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
		"maxInvestment": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"minInvestment": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"minInvestmentPrecision": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"dealDate": &graphql.Field{
			Type: graphql.String,
		},
		"tokenPrice": &graphql.Field{
			Type: graphql.String,
		},
		"vesting": &graphql.Field{
			Type: graphql.String,
		},
		"totalRaisingAmount": &graphql.Field{
			Type: graphql.String,
		},
		"syndicateRaisingAmount": &graphql.Field{
			Type: graphql.String,
		},
		"leadingInvestor": &graphql.Field{
			Type: graphql.String,
		},
		"category": &graphql.Field{
			Type: graphql.String,
		},
		"valuation": &graphql.Field{
			Type: graphql.String,
		},
		"tge": &graphql.Field{
			Type: graphql.String,
		},
		"claim": &graphql.Field{
			Type: graphql.String,
		},
		"overview": &graphql.Field{
			Type: graphql.String,
		},
		"longDescription": &graphql.Field{
			Type: graphql.String,
		},
		"createdAt": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
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
		"invested": &graphql.Field{
			Type: graphql.NewList(investmentType),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				project, ok := params.Source.(*dbModels.Project)
				userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
				if !ok {
					return nil, fmt.Errorf("user not found")
				}
				return allocationService.GetInvestmentsByProjectIDAndUser(project.ID, userDetail.UserID)
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
			Type: graphql.Float,
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
		"createdAt": &graphql.Field{
			Type: graphql.NewNonNull(graphql.DateTime),
		},
		"amount": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"precision": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"txHash": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"ethAddress": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"status": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
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

var createProjectInputType = graphql.NewInputObject(graphql.InputObjectConfig{
	Name: "CreateProjectInput",
	Fields: graphql.InputObjectConfigFieldMap{
		"name": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"description": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"type": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
		"imageUrl": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"allocation": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"startDate": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"endDate": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"minInvestment": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"minInvestmentPrecision": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"maxInvestment": &graphql.InputObjectFieldConfig{
			Type: graphql.Int,
		},
		"approved": &graphql.InputObjectFieldConfig{
			Type: graphql.Boolean,
		},
		"dealDate": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"tokenPrice": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"vesting": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"totalRaisingAmount": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"syndicateRaisingAmount": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"leadingInvestor": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"category": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"valuation": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"tge": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"claim": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"overview": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"longDescription": &graphql.InputObjectFieldConfig{
			Type: graphql.String,
		},
		"ethAddress": &graphql.InputObjectFieldConfig{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
})
