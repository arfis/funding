import {
    GetAllProjectsDocument,
    useGetQuizByTypeQuery,
    useSubmitQuizAnswerMutation,
} from '../../../../../generated/graphql';
import Question from './components/question';
import {useState} from 'react';
import {useLocation} from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const QuizTakePage = ({type}: {type: string}) => {
    const query = useQuery();
    type = query.get("type") || "";

    const initialTestState = {wasTaken: false, isSuccess: false, pointsScored: 0};
    const [testResult, setTestResult] = useState(initialTestState);
    const {loading, error, data} = useGetQuizByTypeQuery({variables: {type}});
    const [takeQuiz, { data: AnswerData, loading: submitLoading, error: submitError }] = useSubmitQuizAnswerMutation({refetchQueries: [{
            query: GetAllProjectsDocument
        }]});
    const quizData = data?.getQuizByType;

    const [answers, setAnswers] = useState<{[questionId: string]: string}>({});

    const handleAnswerChange = (questionId: string, answerId: string) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answerId,
        }));
    };
    const handleSubmit = async () => {
        const formattedAnswers = Object.keys(answers).map(questionId => ({
            quizQuestionID: questionId,
            answerID: answers[questionId],
        }));

        const result = await takeQuiz({
            variables: {
                input: {
                    quizID: quizData!.id,
                    answers: formattedAnswers,
                }
            }
        });

        setTestResult({wasTaken: true, isSuccess: result!.data!.submitQuizAnswer!.success, pointsScored: result!.data!.submitQuizAnswer!.pointsScored})
    };

    if (testResult.wasTaken) {
        return(
            testResult.isSuccess ?
                <h2>Congratulations you have scored {testResult.pointsScored}/{quizData?.questions.length} points and got the test right</h2>
                :
                <div>
                    <h2>Sorry try again you scored just {testResult.pointsScored}/{quizData?.questions.length}</h2>
                    <button onClick={() => setTestResult(initialTestState)}>Try again</button>
                </div>

        )
    }
    return (
        quizData ?
            <div>
                <h1>{quizData?.description}</h1>
                {quizData?.questions.map(question => (
                    <Question key={question.id} question={question as any} handleAnswerChange={handleAnswerChange} />
                ))}
                <button onClick={handleSubmit}>Submit Quiz</button>
            </div>
            : <p>No quizzes found</p>
    )
}

export default QuizTakePage;
