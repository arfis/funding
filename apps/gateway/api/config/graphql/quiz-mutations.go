package graphqlImpl

import (
	"fmt"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/internal/services/authorization"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
	"log"
)

var createQuizMutation = &graphql.Field{
	Type: quizType,
	Args: graphql.FieldConfigArgument{
		"input": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(quizInputType),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
		if !ok {
			log.Println("UserID not found or is not of type uuid.UUID")
			return nil, fmt.Errorf("user not found")
		}
		inputMap, _ := params.Args["input"].(map[string]interface{})

		description, _ := inputMap["description"].(string)
		minimalPointsToSuccess, _ := inputMap["minimalPointsToSuccess"].(int)

		//typeStr := params.Args["type"].(string)
		typeStr, _ := inputMap["type"].(string)
		investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)

		if err != nil {
			log.Println("GOT ERROR")
			return nil, err
		}

		log.Println("CREATING QUIZ4")
		if err != nil {
			log.Println("Wrong type used")
		}
		var questions []dbModels.QuizQuestion
		questionsInput, _ := inputMap["questions"].([]interface{})
		for _, questionInterface := range questionsInput {
			questionMap, _ := questionInterface.(map[string]interface{})
			question := dbModels.QuizQuestion{
				Description: questionMap["description"].(string),
				AnswerType:  questionMap["answerType"].(string),
			}
			var answers []dbModels.Answer
			answersInput, _ := questionMap["answers"].([]interface{})
			for _, answerInterface := range answersInput {
				answerMap, _ := answerInterface.(map[string]interface{})
				answer := dbModels.Answer{
					Description: answerMap["description"].(string),
					IsRight:     answerMap["isRight"].(bool),
				}
				answers = append(answers, answer)
			}
			question.Answers = answers
			questions = append(questions, question)
		}
		quiz := dbModels.Quiz{
			ID:                     uuid.New(),
			Description:            description,
			Questions:              questions,
			Type:                   investmentTypeEnum,
			UserID:                 userDetail.UserID,
			MinimalPointsToSuccess: minimalPointsToSuccess,
		}
		return quizService.Create(&quiz)
	},
}

var updateQuizMutation = &graphql.Field{
	Type: quizType,
	Args: graphql.FieldConfigArgument{
		"id": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"input": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(updateQuizInputType),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
		if !ok {
			log.Println("UserID not found or is not of type uuid.UUID")
			return nil, fmt.Errorf("user not found")
		}

		idStr, _ := params.Args["id"].(string)
		quizID := uuid.MustParse(idStr)
		inputMap, _ := params.Args["input"].(map[string]interface{})

		description, _ := inputMap["description"].(string)
		minimalPointsToSuccess, _ := inputMap["minimalPointsToSuccess"].(int)
		typeStr, _ := inputMap["type"].(string)
		investmentTypeEnum, err := enum.ParseInvestmentType(typeStr)
		if err != nil {
			log.Println("Wrong type used")
			return nil, err
		}

		var questions []dbModels.QuizQuestion
		questionsInput, _ := inputMap["questions"].([]interface{})
		for _, questionInterface := range questionsInput {
			questionMap, _ := questionInterface.(map[string]interface{})
			question := dbModels.QuizQuestion{
				Description: questionMap["description"].(string),
				AnswerType:  questionMap["answerType"].(string),
			}
			var answers []dbModels.Answer
			answersInput, _ := questionMap["answers"].([]interface{})
			for _, answerInterface := range answersInput {
				answerMap, _ := answerInterface.(map[string]interface{})
				answer := dbModels.Answer{
					Description: answerMap["description"].(string),
					IsRight:     answerMap["isRight"].(bool),
				}
				answers = append(answers, answer)
			}
			question.Answers = answers
			questions = append(questions, question)
		}

		quiz := dbModels.Quiz{
			ID:                     quizID,
			Description:            description,
			Questions:              questions,
			Type:                   investmentTypeEnum,
			UserID:                 userDetail.UserID,
			MinimalPointsToSuccess: minimalPointsToSuccess,
		}

		updatedQuiz, err := quizService.UpdateQuiz(&quiz)
		if err != nil {
			return nil, err
		}

		return updatedQuiz, nil
	},
}

var submitQuizAnswerMutation = &graphql.Field{
	Type: graphql.NewObject(graphql.ObjectConfig{
		Name: "SubmitQuizResponse",
		Fields: graphql.Fields{
			"success":      &graphql.Field{Type: graphql.NewNonNull(graphql.Boolean)},
			"pointsScored": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
		},
	}),
	Args: graphql.FieldConfigArgument{
		"input": &graphql.ArgumentConfig{
			Type: graphql.NewNonNull(submitQuizInputType),
		},
	},
	Resolve: func(params graphql.ResolveParams) (interface{}, error) {
		userDetail, ok := params.Context.Value("userDetail").(*authorization.JwtTokenContent)
		if !ok {
			log.Println("UserID not found or is not of type uuid.UUID")
			return nil, fmt.Errorf("user not found")
		}

		inputMap, _ := params.Args["input"].(map[string]interface{})
		quizIDStr, _ := inputMap["quizID"].(string)
		quizID := uuid.MustParse(quizIDStr)

		answersInput, _ := inputMap["answers"].([]interface{})
		var userAnswers []dbModels.Answer
		for _, answerInterface := range answersInput {
			answerMap, _ := answerInterface.(map[string]interface{})
			answer := dbModels.Answer{
				QuizQuestionID: uuid.MustParse(answerMap["quizQuestionID"].(string)),
				ID:             uuid.MustParse(answerMap["answerID"].(string)),
			}
			userAnswers = append(userAnswers, answer)
		}

		// Implement the logic to evaluate the user's answers and calculate the points scored.
		var pointsScored int
		for _, answer := range userAnswers {
			correctAnswer, err := quizService.GetCorrectAnswer(answer.QuizQuestionID)
			if err != nil {
				return nil, fmt.Errorf("error fetching correct answer: %v", err)
			}
			if answer.ID == correctAnswer.ID {
				pointsScored++
			}
		}

		// Save the user's quiz attempt
		quizTake := dbModels.QuizTake{
			ID:           uuid.New(),
			QuizID:       quizID,
			UserID:       userDetail.UserID,
			Successness:  pointsScored >= len(userAnswers)/2, // Example: success if at least half are correct
			PointsScored: pointsScored,
		}

		_, err := quizService.SaveQuizTake(&quizTake)
		if err != nil {
			return nil, err
		}

		return map[string]interface{}{
			"success":      quizTake.Successness,
			"pointsScored": quizTake.PointsScored,
		}, nil
	},
}
