package service

import (
	"fmt"
	database "github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"github.com/arfis/crowd-funding/gateway/pkg/enum"
	"github.com/google/uuid"
	"log"
)

type QuizService struct{}

func (QuizService *QuizService) UpdateQuiz(quiz *database.Quiz) (*database.Quiz, error) {

	err := databaseConnection.Save(quiz).Error
	if err != nil {
		return nil, err
	}
	return quiz, nil
}

func (QuizService *QuizService) GetCorrectAnswer(QuizQuestionID uuid.UUID) (*database.Answer, error) {
	var answer database.Answer
	err := databaseConnection.First(&answer, "quiz_question_id = ? AND is_right = true", QuizQuestionID).Error
	if err != nil {
		return nil, err
	}
	return &answer, nil
}

func (QuizService *QuizService) SaveQuizTake(take *database.QuizTake) (*database.QuizTake, error) {
	err := databaseConnection.Create(take).Error
	if err != nil {
		return nil, err
	}
	return take, nil
}

func (quizService *QuizService) Create(quiz *database.Quiz) (*database.Quiz, error) {

	err := databaseConnection.Create(quiz).Error
	if err != nil {
		return nil, err
	}
	return quiz, nil
}

func (quizService *QuizService) ListAll() ([]*database.Quiz, error) {
	var quizes []*database.Quiz
	err := databaseConnection.Find(&quizes).Error
	log.Printf("LISTING ALL QUIZES %d", len(quizes))
	if err != nil {
		return nil, err
	}
	return quizes, nil
}

func (quizService *QuizService) GetByType(quizType enum.InvestmentType) (*database.Quiz, error) {
	var quiz database.Quiz
	fmt.Printf("\nFinding project by type %s", quizType.String())
	err := databaseConnection.First(&quiz, "type = ?", quizType).Error
	if err != nil {
		return nil, err
	}
	return &quiz, nil
}

func (quizService *QuizService) GetByID(id uuid.UUID) (*database.Quiz, error) {
	var quiz database.Quiz
	fmt.Printf("\nFinding project %d", id)
	err := databaseConnection.First(&quiz, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &quiz, nil
}

func (quizService *QuizService) GetQuizQuestions(quizId uuid.UUID) ([]*database.QuizQuestion, error) {
	var quizQuestions []*database.QuizQuestion
	fmt.Printf("\nFinding quiz questions for quiz ID: %v", quizId)
	err := databaseConnection.Where("quiz_id = ?", quizId).Find(&quizQuestions).Error
	if err != nil {
		return nil, err
	}
	return quizQuestions, nil
}

func (quizService *QuizService) GetQuizQuestionAnswers(quizQuestionId uuid.UUID) ([]*database.Answer, error) {
	var quizQuestionAnswers []*database.Answer
	fmt.Printf("\nFinding quiz question answers %d", quizQuestionId)
	err := databaseConnection.Find(&quizQuestionAnswers, "quiz_question_id = ?", quizQuestionId).Error
	if err != nil {
		return nil, err
	}
	return quizQuestionAnswers, nil
}
