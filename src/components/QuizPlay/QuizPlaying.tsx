import { useEffect, useState } from "react"
import { NewQuestionItem } from "../../interfaces/NewQuestionItem"
import classNames from "classnames"
import Timer from "./Timer";
import userGuessIcon from '../../assets/icons/user-guess-icon.svg'
import { AnsweredQuestion } from "../../interfaces/AnsweredQuestion";

interface Props {
    questions: NewQuestionItem[]
}

let timer: any = null;
let nextQuestionTimer: any = null;

const QuizPlaying = ({questions}: Props) => {

    const [questionsSet, setQuestionsSet] = useState<NewQuestionItem[]>([])
    const [questionNumber, setQuestionNumber] = useState(1)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [questionStatus, setQuestionStatus] = useState<'live'|'finished'>('live')
    const [userGuess, setUserGuess] = useState('')
    const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([])
    const [timeToNextQuestion, setTimeToNextQuestion] = useState(5)

    const answerGiven = (guess :string = '') => {

        if (questionStatus !== "live") {
            return
        }

        clearInterval(timer)
        console.log('timer should have stopped')
        setQuestionStatus('finished')
        setUserGuess(guess)

        const wasGuessCorrect = questionsSet[questionNumber - 1].answers.find((ans) => {
            return ans.isCorrect && (ans.text === guess)
        })

        if (wasGuessCorrect) {
            setScore( score => score + 1 )
        }

        const newAnswer = {
            guess,
            ...questionsSet[questionNumber - 1]
        }

        setAnsweredQuestions([...answeredQuestions, newAnswer])

        if (questionNumber === questionsSet.length) {
            
            // Set game over
            return

        }

        nextQuestionTimer = setInterval(() => {
            setTimeToNextQuestion( time => time - 1)
        }, 1000)

    }

    const goToNextQuestion = () => {

        clearInterval(nextQuestionTimer)
        setUserGuess('')
        setQuestionNumber(question => question + 1)
        setQuestionStatus('live')
        setTimeToNextQuestion(5)

    }

    const arrayShuffle = (array: any) => {

        const tempArray = [...array]

        for (let i = tempArray.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1))
            const tempElement = tempArray[i]
            tempArray[i] = tempArray[r]
            tempArray[r] = tempElement
        }

        return tempArray

    }

    useEffect(()=>{

        if (timeToNextQuestion === 0) {
            goToNextQuestion()
        }

    }, [timeToNextQuestion])

    useEffect(()=>{

        console.log(answeredQuestions)

    }, [answeredQuestions])

    useEffect(()=>{

        const shuffledArray :NewQuestionItem[] = arrayShuffle(questions)

        shuffledArray.forEach((elm, i)=>{
            elm.answers = arrayShuffle(elm.answers)
        })

        setQuestionsSet([...shuffledArray])

    }, [questions])

    useEffect(() => {
        console.log(questionNumber)
        setTimeLeft(30)

        timer = setInterval(()=>{
            console.log('lorem ipsum')
            setTimeLeft( timeLeft => timeLeft - 1 )
        }, 1000)

        return ()=> clearInterval(timer)

    }, [questionNumber])

    useEffect(() => {

        if (timeLeft <= 0) {
            answerGiven()
        }

    }, [timeLeft])

    return (
        <div className="quiz-playing-container">
            {
                !!questionsSet.length && (
                    <>
                    <div className="quiz-metadata">
                        <Timer timeLeft={timeLeft} />
                        <div className="number-score-container">
                            <span className="question-number">Question {questionNumber} / {questionsSet.length}</span>
                            <span>|</span>
                            <span className="score-counter">Score: {score}</span>
                        </div>
                        
                    </div>

                    <div className="question-container">
                        <header>
                            <h2 className="question-text">{questionsSet[questionNumber - 1].questionText}</h2>
                        </header>
                        <main>
                            {
                                !!questionsSet[questionNumber - 1].answers.length && questionsSet[questionNumber - 1].answers.map((ans, i)=>(
                                    <div className="question-answer-container" key={i}>
                                        {
                                            ans.text === userGuess && (
                                                <img src={userGuessIcon} />
                                            )
                                        }
                                        
                                        <div 
                                            onClick={()=>{answerGiven(ans.text)}} 
                                            className={classNames({
                                                'question-answer': true,
                                                'question-answer-correct': questionStatus === 'finished' && ans.isCorrect,
                                                'question-answer-wrong': questionStatus === 'finished' && !ans.isCorrect
                                            })}
                                        >
                                            <span>{ans.text}</span>
                                        </div>
                                    </div>
                                ))
                            }
                        </main>
                        <footer>
                            {
                                questionStatus === "finished" && questionsSet.length !== questionNumber && (
                                    <div className="next-round-timer-container">
                                        <span>Next</span>
                                        <span>{timeToNextQuestion}</span>
                                    </div>
                                )
                            }
                        </footer>
                    </div>
                    </>
                )
            }

            

        </div>
    )
}

export default QuizPlaying