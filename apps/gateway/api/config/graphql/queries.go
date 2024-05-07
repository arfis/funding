package graphqlImpl

import (
	"fmt"
	"github.com/arfis/crowd-funding/gateway/internal/services/authorization"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
	"log"
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

				userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
				if !ok {
					log.Println("NO USER")
				}
				switch userDetail.Type {
				case authorization.Onboarded.GetString():
					log.Println("ONBOARDED")
					return projectService.ListAllApprovedProjects()
				case authorization.Admin.GetString():
					log.Println("ADMIN")
					return projectService.ListAllProjects()
				default:
					return nil, fmt.Errorf("unauthorized access")
				}

				//return projectService.ListAllForUser(userID)
				// Assume this function fetches all projects
			},
		},
		"getAllQuizes": &graphql.Field{
			Type: graphql.NewList(quizType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				// Simulate fetching a quiz by ID
				return quizService.ListAll()
			},
		},
		"getQuiz": &graphql.Field{
			Type: quizType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				id, _ := p.Args["id"].(string)
				// Simulate fetching a quiz by ID
				return quizService.GetByID(uuid.MustParse(id))
			},
		},
		"getQuizByType": &graphql.Field{
			Type: quizType,
			Args: graphql.FieldConfigArgument{
				"type": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				typeStr := params.Args["type"].(string)
				investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)

				if err != nil {
					log.Println("Wrong type used")
				}
				return quizService.GetByType(investmentTypeEnum)

			},
		},
	},
})
