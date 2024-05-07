import {Quiz} from '../../../../generated/graphql';

export class QuizDescriptionProps {
    quiz!: Quiz;  // Using the Quiz type directly from the generated file
    showAnswerOptions!: boolean;
};
