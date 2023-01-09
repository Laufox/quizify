import { useEffect, useState, useRef } from "react"
import { NewQuestionItem } from "../../interfaces/NewQuestionItem"
import classNames from "classnames"

interface Props {
    questions: NewQuestionItem[]
}

let timer: any = null;

const QuizPlaying = ({questions}: Props) => {

    const [questionsSet, setQuestionsSet] = useState<NewQuestionItem[]>([])
    const [questionNumber, setQuestionNumber] = useState(1)
    const [score, setScore] = useState(0)
    const [timeLeft, setTimeLeft] = useState(30)
    const [questionStatus, setQuestionStatus] = useState<'live'|'finished'>('live')

    const timerRef = useRef<HTMLCanvasElement>(null)

    const answerGiven = () => {

        if (questionStatus !== "live") {
            return
        }

        clearInterval(timer)
        console.log('timer should have stopped')
        setQuestionStatus('finished')

    }

    const drawTimer = () => {

        if (!timerRef.current) {
            return
        }

    }

    useEffect(()=>{

        // TODO: Shuffle order of array
        setQuestionsSet([...questions])

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

        drawTimer()
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
                        {/* <p className="time-counter">{timeLeft}</p> */}
                        <svg>
                            <circle clipPath="" />
                            <text>30</text>
                        </svg>
                        <span className="question-number">Question {questionNumber} / {questionsSet.length}</span>
                        <span className="score-counter">Score: {score}</span>
                    </div>

                    <div className="question-container">
                        <header>
                            <h2 className="question-text">{questionsSet[questionNumber - 1].questionText}</h2>
                        </header>
                        <main>
                            {
                                !!questionsSet[questionNumber - 1].answers.length && questionsSet[questionNumber - 1].answers.map((ans, i)=>(
                                    <div 
                                        key={i} 
                                        onClick={()=>{answerGiven()}} 
                                        className={classNames({
                                            'question-answer': true,
                                            'question-answer-correct': questionStatus === 'finished'
                                        })}
                                    >
                                        <span>{ans.text}</span>
                                    </div>
                                ))
                            }
                        </main>
                    </div>
                    </>
                )
            }

            

        </div>
    )
}

export default QuizPlaying