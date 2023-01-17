import { useState, useEffect } from "react"

import classNames from "classnames"
import { NewQuestionInput } from "../interfaces/NewQuestionInput"

interface Props {
    onAddNewQuestion: (newQuestionInput: NewQuestionInput) => void
}

const NewQuestionForm = ({onAddNewQuestion} : Props) => {

    const [questionInput, setQuestionInput] = useState('')
    const [correctAnswerInput, setCorrectAnswerInput] = useState('')
    const [firstWrongAnswerInput, setFirstWrongAnswerInput] = useState('')
    const [secondWrongAnswerInput, setSecondWrongAnswerInput] = useState('')
    const [thirdWrongAnswerInput, setThirdWrongAnswerInput] = useState('')
    const [newQuestionError, setNewQuestionError] = useState('')
    const [isFormDataInvalid, setIsFormDataInvalid] = useState(true)

    const addNewQuestion = () => {

        setNewQuestionError('')
        if (
            correctAnswerInput === firstWrongAnswerInput ||
            correctAnswerInput === secondWrongAnswerInput ||
            correctAnswerInput === thirdWrongAnswerInput ||
            firstWrongAnswerInput === secondWrongAnswerInput ||
            firstWrongAnswerInput === thirdWrongAnswerInput ||
            secondWrongAnswerInput === thirdWrongAnswerInput
        ) {
            setNewQuestionError('All four answers must be unique')
            return
        }

        if (isFormDataInvalid) {
            return
        }

        onAddNewQuestion({
            question: questionInput,
            correctAnswer: correctAnswerInput,
            firstWrongAnswer: firstWrongAnswerInput,
            secondWrongAnswer: secondWrongAnswerInput,
            thirdWrongAnswer: thirdWrongAnswerInput
        })

        setQuestionInput('')
        setCorrectAnswerInput('')
        setFirstWrongAnswerInput('')
        setSecondWrongAnswerInput('')
        setThirdWrongAnswerInput('')
        
    }

    useEffect(()=>{

        if (!questionInput || !correctAnswerInput || !firstWrongAnswerInput || !secondWrongAnswerInput || !thirdWrongAnswerInput) {
            setIsFormDataInvalid(true)
            return
        }
        setIsFormDataInvalid(false)

    }, [questionInput, correctAnswerInput, firstWrongAnswerInput, secondWrongAnswerInput, thirdWrongAnswerInput])

    return (

        <div className="new-question-form">

            <h3>Add new question:</h3>
            <label htmlFor="questionname">Question</label>
            <input 
                id="questionname"
                type='text'
                value={questionInput}
                onChange={(e)=>{
                    setQuestionInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label htmlFor="questioncorrectanswer">Correct answer</label>
            <input 
                id="questioncorrectanswer"
                type='text'
                value={correctAnswerInput}
                onChange={(e)=>{
                    setCorrectAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label htmlFor="questionfirstwronganswer">Other alternative</label>
            <input 
                id="questionfirstwronganswer"
                type='text'
                value={firstWrongAnswerInput}
                onChange={(e)=>{
                    setFirstWrongAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label htmlFor="questionsecondwronganswer">Other alternative</label>
            <input 
                id="questionsecondwronganswer"
                type='text'
                value={secondWrongAnswerInput}
                onChange={(e)=>{
                    setSecondWrongAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label htmlFor="questionthirdwronganswer">Other alternative</label>
            <input 
                id="questionthirdwronganswer"
                type='text'
                value={thirdWrongAnswerInput}
                onChange={(e)=>{
                    setThirdWrongAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            {
                newQuestionError && (
                    <div>
                        <p className="error-message">{newQuestionError}</p>
                    </div>
                )
            }

            <button
                type="button"
                className={classNames({
                    'btn': true,
                    'btn-info': true,
                    'btn-disabled': isFormDataInvalid
                })}
                title={
                    isFormDataInvalid ? 'Please fill out all five fields above first' : 'Add question'
                }
                disabled={
                    isFormDataInvalid
                }
                onClick={
                    addNewQuestion
                }
            >
                Add
            </button>

        </div>

    )
}

export default NewQuestionForm