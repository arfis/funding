import React from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
    GetAllProjectsDocument, GetQuizesDocument, GetQuizesQuery, Quiz,
    useCreateProjectMutation,
    useCreateQuizMutation
} from '../../../../../generated/graphql';
import styled from 'styled-components';
import {QuizDescriptionProps} from '../quizProps';


const Answers = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 10px;
`

const Answer = styled.div`
    display: inline-block;
    width: 50%;
    border: 1px solid black;
    box-sizing: content-box;
    padding: 10px;
    color: red;
    
    &.rightAnswer {
        color: green;
    }
`


const QuizDescription:React.FC<QuizDescriptionProps> = ({ quiz, showAnswerOptions }) => {
    return (
        <div>
            <h1>{quiz.description}</h1>
            {quiz && showAnswerOptions && quiz.questions!.map(question =>
                <div key={question.id}>
                    <h4>{question.description}</h4>
                    <Answers >
                        {question.answers.map(answer =>
                            <Answer className={answer.isRight ? 'rightAnswer' : ''} key={answer.id}>
                                <span>{answer.description} {answer.isRight}</span>
                            </Answer>
                            )}
                    </Answers>
                </div>
            )}
        </div>
    );
}

export default QuizDescription;
