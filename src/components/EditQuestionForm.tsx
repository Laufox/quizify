import { useState, useEffect } from 'react'

import classNames from 'classnames'

interface NewQuestionInputObject {
    question: string,
    correctAnswer: string,
    firstWrongAnswer: string,
    secondWrongAnswer: string,
    thirdWrongAnswer: string
}

interface Props {
    question: {
        questionText: string,
        answers: {
            isCorrect: boolean,
            text: string
        }[]
    },
    onEdit: (updatedQuestion: NewQuestionInputObject) => void,
    onDelete: () => void
}

const EditQuestionForm = ({question, onEdit, onDelete}: Props) => {

    const [questionInput, setQuestionInput] = useState('')
    const [correctAnswerInput, setCorrectAnswerInput] = useState('')
    const [firstWrongAnswerInput, setFirstWrongAnswerInput] = useState('')
    const [secondWrongAnswerInput, setSecondWrongAnswerInput] = useState('')
    const [thirdWrongAnswerInput, setThirdWrongAnswerInput] = useState('')

    const [isFormDataInvalid, setIsFormDataInvalid] = useState(true)

    useEffect(()=>{

        if (!questionInput || !correctAnswerInput || !firstWrongAnswerInput || !secondWrongAnswerInput || !thirdWrongAnswerInput) {
            setIsFormDataInvalid(true)
            return
        }
        setIsFormDataInvalid(false)

    }, [questionInput, correctAnswerInput, firstWrongAnswerInput, secondWrongAnswerInput, thirdWrongAnswerInput])

    useEffect(()=>{

        setQuestionInput(question.questionText)
        setCorrectAnswerInput(question.answers[0].text)
        setFirstWrongAnswerInput(question.answers[1].text)
        setSecondWrongAnswerInput(question.answers[2].text)
        setThirdWrongAnswerInput(question.answers[3].text)

    }, [])

    return (
        <main className="new-question-form">
            <label>Question</label>
            <input 
                type='text'
                defaultValue={question.questionText}
                onChange={(e)=>{
                    setQuestionInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label>Correct answer</label>
            <input 
                type='text'
                defaultValue={question.answers[0].text}
                onChange={(e)=>{
                    setCorrectAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label>Other alternative</label>
            <input 
                type='text'
                defaultValue={question.answers[1].text}
                onChange={(e)=>{
                    setFirstWrongAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label>Other alternative</label>
            <input 
                type='text'
                defaultValue={question.answers[2].text}
                onChange={(e)=>{
                    setSecondWrongAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <label>Other alternative</label>
            <input 
                type='text'
                defaultValue={question.answers[3].text}
                onChange={(e)=>{
                    setThirdWrongAnswerInput(e.target.value)
                }}
                onKeyDown={(e)=>{
                    if (e.key === "Enter") {
                        e.preventDefault()
                    }
                }}
            />

            <div className="action-btn-container">
                <button
                    type="button"
                    className={classNames({
                        'btn': true,
                        'btn-info': true,
                        'btn-disabled': isFormDataInvalid
                    })}
                    title={
                        isFormDataInvalid ? 'Please fill out all five fields above first' : 'Update question'
                    }
                    disabled={
                        isFormDataInvalid
                    }
                    onClick={()=>{

                        if (isFormDataInvalid) {
                            return
                        }

                        onEdit({
                            question: questionInput,
                            correctAnswer: correctAnswerInput,
                            firstWrongAnswer: firstWrongAnswerInput,
                            secondWrongAnswer: secondWrongAnswerInput,
                            thirdWrongAnswer: thirdWrongAnswerInput
                        })
                    }}
                >
                    Save
                </button>

                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={()=>{onDelete()}}
                >
                    Delete
                </button>
            </div>
        </main>
    )
}

export default EditQuestionForm