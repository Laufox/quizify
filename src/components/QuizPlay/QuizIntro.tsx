import { Link } from "react-router-dom"
import { Quiz } from "../../interfaces/Quiz"

interface Props {
    quiz: Quiz,
    onBegin: () => void
}

const QuizIntro = ({quiz, onBegin}: Props) => {

    return (
        <div className='quiz-info-container'>
            <p className='quiz-info-author-text'>
                Created by 
                <Link to={`/profile/${quiz.authorId}`} className='quiz-info-author-link' >{quiz.authorName}</Link> 
                <span>{quiz.createdAt}</span>
            </p>
            <div className='tags-container'>
                {
                    !!quiz.tags.length && quiz.tags.map((tag, i)=>(
                        <span key={i}>#{tag}</span>
                    ))
                }
            </div>
            <p className='description-text'>
                {quiz.description}
            </p>
            <p className='quiz-questions-amount'>
                This quiz contains <strong>{quiz.questions.length} {quiz.questions.length > 1 ? `questions` : `question`}</strong>. For each question you have <strong>30 seconds</strong> to give an answer (max time for this quiz is {quiz.questions.length > 3 ? `${quiz.questions.length / 2} minutes` : `${quiz.questions.length * 30} seconds`}).<br /><br /> The quiz will begin automatically when you click the button below. Good luck!
            </p>

            <button 
                className='btn btn-confirm'
                onClick={onBegin}
            >
                Begin quiz
            </button>
        </div>
    )
}
export default QuizIntro