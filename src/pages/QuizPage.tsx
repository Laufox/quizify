import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Alert from '../components/Alert'
import LoadingSpinnerGeneric from '../components/LoadingSpinnerGeneric'
import PageTransition from '../components/PageTransition'
import QuizIntro from '../components/QuizPlay/QuizIntro'
import QuizPlaying from '../components/QuizPlay/QuizPlaying'
import QuizResults from '../components/QuizPlay/QuizResults'

import { useAuthContext } from '../contexts/AuthContext'
import { AnsweredQuestion } from '../interfaces/AnsweredQuestion'
import { Quiz } from '../interfaces/Quiz'

import { AnimatePresence } from 'framer-motion'

const QuizPage = () => {

    const { id } = useParams()

    const { getQuizDocument, currentUser, addQuizResultToUser, loading } = useAuthContext()

    const [quiz, setQuiz] = useState<Quiz>()
    const [quizStatus, setQuizStatus] = useState<'intro'|'playing'|'over'>('intro')
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
    const [score, setScore] = useState<number>(0)
    const [scorePercent, setScorePercent] = useState<number>(0)
    const [firebaseError, setFirebaseError] = useState('')

    const applyQuiz = async () => {

        const response = await getQuizDocument(id)

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return

        }

        setQuiz(response.quiz)

    }

    const beginQuiz = () => {

        setQuizStatus('playing')

    }

    const endQuiz = async (answers: AnsweredQuestion[]) => {

        setAnsweredQuestions([...answers])

        const userScore = answers.filter((quest) => {

            return quest.answers.find((ans) => {
                return ans.isCorrect && (ans.text === quest.guess)
            })

        }).length

        const scorePercentage = Math.round((userScore / answers.length) * 100)

        setScore(userScore)
        setScorePercent(Math.round((userScore / answers.length) * 100))
        setQuizStatus('over')

        if (!currentUser) {
            return
        }

        const response = await addQuizResultToUser({
            id,
            name: quiz?.name,
            numberOfQuestions: answers.length,
            score: userScore,
            scorePercentage: scorePercentage
        })
        
        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error occured')
        }

    }

    const handleReplay = () => {

        setQuizStatus('intro')

    }

    useEffect(()=>{

        if(id) {
            applyQuiz()
        }

    }, [id])

    return (
        <PageTransition extraClasses='quiz-container'>
            <>
            {
                loading.getQuiz ? (

                    <LoadingSpinnerGeneric size='large' />

                ) : (

                    quiz && (
                        <>
                        <h1>{quiz.name}</h1>
                        <AnimatePresence mode='wait'>
                        {
                            quizStatus === 'intro' && (
                                <PageTransition key={'intro'} encapsulated>
                                    <QuizIntro quiz={quiz} onBegin={beginQuiz} />
                                </PageTransition>
                            )
                        }
    
                        {
                            quizStatus === 'playing' && (
                                <PageTransition key={'playing'} encapsulated>
                                    <QuizPlaying questions={quiz.questions} onFinish={endQuiz} />
                                </PageTransition>
                            )
                        }
    
                        {
                            quizStatus === 'over' && (
                                <PageTransition key={'over'} encapsulated>
                                    <QuizResults answeredQuestions={answeredQuestions} score={score} scorePercent={scorePercent} onReplay={handleReplay} />
                                </PageTransition>
                            )
                        }
                        </AnimatePresence>
                        
                        </>
                    )

                )
                
            }

            {
                firebaseError && (
                    <Alert
                        onCancel={()=>{setFirebaseError('')}}
                        message={firebaseError}
                    />
                )
            }
            </>
        </PageTransition>
    )
}

export default QuizPage