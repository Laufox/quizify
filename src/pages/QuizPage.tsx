import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import QuizIntro from '../components/QuizPlay/QuizIntro'
import QuizPlaying from '../components/QuizPlay/QuizPlaying'

import { useAuthContext } from '../contexts/AuthContext'
import { Quiz } from '../interfaces/Quiz'

const QuizPage = () => {

    const { id } = useParams()

    const { getQuizDocument } = useAuthContext()

    const [quiz, setQuiz] = useState<Quiz>()
    const [quizStatus, setQuizStatus] = useState<'intro'|'playing'|'over'>('intro')

    const applyQuiz = async () => {

        setQuiz(await getQuizDocument(id))

    }

    const beginQuiz = () => {

        setQuizStatus('playing')
        console.log('to start')

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
                            <QuizPlaying questions={quiz.questions} />
                        )
                    }
                    
                    </>
                )
            }
            
        </div>
    )
}

export default QuizPage