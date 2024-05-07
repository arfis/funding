import {QuizQuestion} from '../../../../../../generated/graphql';
import {useState} from 'react';

const Question = ({question, handleAnswerChange}: {question: QuizQuestion, handleAnswerChange: (questionId: string, answerId: string) => void}) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const answerId = event.target.value;
        setSelectedAnswer(answerId);
        handleAnswerChange(question.id, answerId);
    }

    return (
        <div>
            <h4>{question!.description}</h4>
            <div>
                {question.answers && question.answers!.map(answer =>
                    <label key={answer.id}>
                        <input type="radio" name={question.id} value={answer.id} checked={selectedAnswer === answer.id} onChange={handleChange}/>
                        {answer.description}
                    </label>
                )}
            </div>
        </div>
    )
}

export default Question;
