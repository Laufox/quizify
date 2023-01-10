import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import QuizIntro from '../components/QuizPlay/QuizIntro'
import QuizPlaying from '../components/QuizPlay/QuizPlaying'
import QuizResults from '../components/QuizPlay/QuizResults'

import { useAuthContext } from '../contexts/AuthContext'
import { AnsweredQuestion } from '../interfaces/AnsweredQuestion'
import { Quiz } from '../interfaces/Quiz'

const QuizPage = () => {

    const { id } = useParams()

    const { getQuizDocument } = useAuthContext()

    const [quiz, setQuiz] = useState<Quiz>()
    const [quizStatus, setQuizStatus] = useState<'intro'|'playing'|'over'>('intro')
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])

    const applyQuiz = async () => {

        setQuiz(await getQuizDocument(id))

    }

    const beginQuiz = () => {

        setQuizStatus('playing')
        console.log('to start')

    }

    const endQuiz = (answers: AnsweredQuestion[]) => {

        setQuizStatus('over')
        console.log('quiz done')
        setAnsweredQuestions([...answers])

    }

    useEffect(()=>{

        if(id) {
            applyQuiz()
        }

    }, [id])

    useEffect(()=>{

        console.log(quiz)

    }, [quiz])

    return (
        <div className='page-container quiz-container'>
            {
                quiz && (
                    <>
                    <h1>{quiz.name}</h1>
                    {
                        quizStatus === 'intro' && (
                            <QuizIntro quiz={quiz} onBegin={beginQuiz} />
                        )
                    }

                    {
                        quizStatus === 'playing' && (
                            <QuizPlaying questions={quiz.questions} onFinish={endQuiz} />
                        )
                    }

                    {
                        quizStatus === 'over' && (
                            <QuizResults answeredQuestions={answeredQuestions} />
                        )
                    }
                    
                    </>
                )
            }
            
        </div>
    )
}

export default QuizPage