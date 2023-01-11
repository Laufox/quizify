import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnsweredQuestion } from "../../interfaces/AnsweredQuestion"
import accordionIcon from '../../assets/icons/accordion-icon.svg'
import userGuessIcon from '../../assets/icons/user-guess-icon.svg'
import classNames from 'classnames'

interface Props {
    answeredQuestions: AnsweredQuestion[],
    score: number,
    scorePercent: number,
    onReplay: () => void
}

const QuizResults = ({answeredQuestions, score, scorePercent, onReplay}: Props) => {

    const [questionToShow, setQuestionToShow] = useState(-1)

    return (
        <div className="quiz-results-container">
            <div className='quiz-results-stats'>
                <span className='score-percentage'>{scorePercent} %</span>
                <p className='score-number'>You got {score} out of {answeredQuestions.length} questions correct</p>
            </div>

            <div className='link-collection'>
                <p className='link' onClick={onReplay}>Play this quiz again</p>
                <Link to='/quizlist'>Back to quiz list</Link>
            </div>

            <div className='quiz-results-summary-container'>
                <header>
                    <h2>Summary of questions</h2>
                </header>
                <main>
                    <div className='quiz-results-questions-container'>
                        {
                            !!answeredQuestions.length && answeredQuestions.map((quest, i) => (
                                <div key={i} className='question-item'>
                                    <header onClick={()=>{
                                        if (questionToShow === i) {
                                            setQuestionToShow(-1)
                                            return
                                        }
                                        setQuestionToShow(i)
                                    }}>
                                        <div 
                                            className={classNames({
                                                'question-item-number-container': true,
                                                'question-item-number-container-correct': quest.answers.find((ans) => {
                                                    return ans.isCorrect && (ans.text === quest.guess)
                                                }),
                                                'question-item-number-container-wrong': !quest.answers.find((ans) => {
                                                    return ans.isCorrect && (ans.text === quest.guess)
                                                })
                                            })}
                                        >
                                            <span className='question-item-number-text'># {i + 1}</span>
                                        </div>
                                        <h3 className='question-item-heading'>{quest.questionText}</h3>
                                        <img className='question-item-accordion-icon' src={accordionIcon} />
                                        
                                    </header>

                                    {
                                        questionToShow === i && (
                                            <main>

                                                <div className="question-container">
                                                    <header>
                                                        <h3 className="question-text">{quest.questionText}</h3>
                                                    </header>
                                                    <main>
                                                        {
                                                            !!quest.answers.length && quest.answers.map((ans, i)=>(
                                                                <div className="question-answer-container" key={i}>
                                                                    {
                                                                        ans.text === quest.guess && (
                                                                            <img src={userGuessIcon} />
                                                                        )
                                                                    }
                                                                    
                                                                    <div  
                                                                        className={classNames({
                                                                            'question-answer': true,
                                                                            'question-answer-correct': ans.isCorrect,
                                                                            'question-answer-wrong': !ans.isCorrect
                                                                        })}
                                                                    >
                                                                        <span>{ans.text}</span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </main>
                                                </div>

                                            </main>
                                        )
                                    }
                                    
                                </div>
                            ))
                        }
                    </div>
                </main>
            </div>
        </div>
    )
}

export default QuizResults