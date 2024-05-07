package graphqlImpl

import (
	"fmt"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/graphql-go/graphql"
)

var answerType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Answer",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"quizQuestionId": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"description": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"isRight": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Boolean),
		},
	},
})

var quizQuestionType = graphql.NewObject(graphql.ObjectConfig{
	Name: "QuizQuestion",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"description": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"answerType": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"answers": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(answerType))),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				quizQuestion, ok := params.Source.(*dbModels.QuizQuestion)
				if !ok {
					return nil, fmt.Errorf("invalid source for quiz question")
				}
				return quizService.GetQuizQuestionAnswers(quizQuestion.ID)
			},
		},
	},
})

var quizType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Quiz",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"type": &graphql.Field{
			Type: graphql.NewNonNull(enum.InvestmentTypeEnum),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				quiz, ok := params.Source.(*dbModels.Quiz)
				if !ok {
					return nil, fmt.Errorf("unexpected source type %T", params.Source)
				}
				return quiz.Type.String(), nil
			},
		},
		"description": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"minimalPointsToSuccess": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
		"questions": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(quizQuestionType))),
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				quiz, ok := params.Source.(*dbModels.Quiz)
				if !ok {
					return nil, fmt.Errorf("invalid source for quiz")
				}
				return quizService.GetQuizQuestions(quiz.ID)
			},
		},
	},
})

// INPUT TYPES
var SubmitAnswerInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "SubmitAnswerInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"quizQuestionID": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.ID),
			},
			"answerID": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.ID),
			},
		},
	},
)

var submitQuizInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "SubmitQuizInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"quizID": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.ID),
			},
			"answers": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(SubmitAnswerInputType))),
			},
		},
	},
)

var answerInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "AnswerInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"isRight": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.Boolean),
			},
		},
	},
)

var quizQuestionInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "QuizQuestionInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"answerType": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"answers": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(answerInputType))),
			},
		},
	},
)

var quizInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "QuizInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"type": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(enum.InvestmentTypeEnum),
			},
			"minimalPointsToSuccess": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"questions": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(quizQuestionInputType))),
			},
		},
	},
)

var updateQuizInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "UpdateQuizInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"description": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"type": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.String),
			},
			"minimalPointsToSuccess": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"questions": &graphql.InputObjectFieldConfig{
				Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(quizQuestionInputType))),
			},
		},
	},
)
