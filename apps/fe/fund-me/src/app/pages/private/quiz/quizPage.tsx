import QuizForm from './components/quizForm';
import {InvestmentType, Quiz, useGetQuizesQuery, useGetQuizTypesQuery} from '../../../../generated/graphql';
import QuizDescription from './components/quizDescription';
import {Link} from 'react-router-dom';
import React, {useMemo, useState} from 'react';
import DockedLayout from '../components/DockeredLayout';
import FloatingButton from '../components/FloatingButton';


export const QuizPage = () => {

    const {loading, error, data} = useGetQuizesQuery();
    const {loading: typeLoading, error: typeError, data: quizTypesData} = useGetQuizTypesQuery();
    const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null)
    const emptyQuiz = useMemo(() => ({
        description: '',
        id: '',
        questions: [],
        type: InvestmentType.CryptoInvestment,
        minimalPointsToSuccess: 0
    }), [])
    if (loading || typeLoading) {
        return <div>Loading...</div>;
    }

    if (error || typeError) {
        return <div>Error: {error?.message || typeError?.message}</div>;
    }

    if (data!.getAllQuizes!.length > 0) {
        return (
            <DockedLayout
                addButton={
                    <FloatingButton onClick={() => setQuizToEdit(emptyQuiz)}></FloatingButton>
                }
                dockedContent={quizToEdit &&
                    <QuizForm quiz={quizToEdit} onCancel={() => setQuizToEdit(null)}></QuizForm>}
                listContent={data && !!data.getAllQuizes && data.getAllQuizes!.map(quiz =>
                    quiz &&
                    <div>
                        <QuizDescription key={quiz.id} quiz={quiz} showAnswerOptions={false}></QuizDescription>
                        <Link to={`/quizTake?type=${quiz.type}`}>Take quiz</Link>
                        <button onClick={() => setQuizToEdit(quiz)}>Edit</button>
                    </div>
                )}>
            </DockedLayout>
        )
    }
    return (<div>There are currently no quizes available</div>)

}

export default QuizPage;
