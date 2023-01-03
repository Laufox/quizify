import { useState, useRef } from "react"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"

type FormData = {
    name: string,
    category: string,
    description: string,
    tags: string,
    visibility: string,
    questionname: string
}

const CreateQuizPage = () => {

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // Funtions and variabels to use from auth context
    const { createQuiz } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState()
    const [showNewQuestionForm, setShowNewQuestionForm] = useState(false)

    const questionNameRef = useRef<HTMLInputElement>(null)
    const questionCorrectAnswerRef = useRef<HTMLInputElement>(null)
    const questionFirstWrongAnswerRef = useRef<HTMLInputElement>(null)
    const questionSecondWrongAnswerRef = useRef<HTMLInputElement>(null)
    const questionThirdWrongAnswerRef = useRef<HTMLInputElement>(null)

    const [questionErrors, setQuestionErrors] = useState({
        questionName: false,
        questionCorrectAnswer: false,
        questionFirstWrongAnswer: false,
        questionSecondWrongAnswer: false,
        questionThirdWrongAnswer: false
    })

    const submitQuiz = async (data: any) => {

        if (data.description) {
            data.description = data.description.trim()
        }

        if (data.tags) {
            data.tags = data.tags.trim().split(' ')
        }
        
        try {
            await createQuiz({
                ...data,
                name: data.name.trim()
            })
        } catch (error: any) {
            setSubmitErrorMessage(error?.message)
        }

    }

    const addNewQuestion = (data: any) => {
        console.log('New question to add: ', data)
    }

    const openNewQuestionForm = () => {
        setShowNewQuestionForm(true)
    }

    const closeNewQuestionForm = () => {
        setShowNewQuestionForm(false)
    }

    const findEmptyInputRefs = () => {
        if ( !questionNameRef.current?.value ) {
            return true
        }
        return false
    }

    return (
        <div className="page-container">

            <h1>Create new quiz</h1>

            <form onSubmit={handleSubmit(submitQuiz)} noValidate>

                <h2>Info</h2>

                <label>Quiz name *</label>
                <input 
                    id="quizname" 
                    type='text' 
                    {...register('name', {
                        required: 'Name of quiz is required'
                    })}
                    placeholder='name'
                    className={classNames({'error-input': errors.name})}
                />
                {errors.name && <span className="form-error-message">{errors.name?.message}</span>}

                <label>Category *</label>
                <select
                    id="quizcategory" 
                    {...register('category', {
                        required: 'Must choose category'
                    })}
                    placeholder='category'
                    className={classNames({'error-input': errors.category})}
                >
                    <option value='history'>History</option>
                    <option value='sport'>Sport</option>
                    <option value='moveis'>Movies</option>
                    <option value='books'>Books</option>
                </select>
                {errors.category && <span className="form-error-message">{errors.category?.message}</span>}

                <label>Description</label>
                <textarea
                    id="quizdesc"  
                    {...register('description')}
                    placeholder='description'
                    className={classNames({'error-input': errors.description})}
                />
                {errors.description && <span className="form-error-message">{errors.description?.message}</span>}

                <label>Tags (seperate each one with space)</label>
                <textarea 
                    id="quiztags"
                    {...register('tags', {
                        pattern: {
                            value: /^[a-z0-9\s]*[a-z0-9][a-z0-9\s]$/gi, 
                            message: 'Tags can only contain characters and numbers, and must be at least two characters long'
                        }
                    })}
                    placeholder='tags'
                    className={classNames({'error-input': errors.tags})}
                />
                {errors.tags && <span className="form-error-message">{errors.tags?.message}</span>}

                <label>Visibility</label>

                <label>
                    <input 
                        id="quizvispublic"
                        type='radio'
                        {...register('visibility')}
                        value='public'
                        defaultChecked
                    />
                    Public
                </label>
                <label>
                    <input 
                        id="quizvispublic"
                        type='radio'
                        {...register('visibility')}
                        value='private'
                    />
                    Private
                </label>

                <hr />

                <div className="questions-heading-container">
                    <h2>Questions</h2>
                    <p className="link" onClick={openNewQuestionForm}>+ Add new</p>
                </div>

                {
                    showNewQuestionForm && (
                        <div className="new-question-form">

                            <label>Question</label>
                            <input 
                                id="questionname"
                                type='text'
                                className={classNames({'error-input': questionErrors.questionName})}
                                ref={questionNameRef}
                                onChange={(e)=>{
                                    if (!e.currentTarget.value) {
                                        setQuestionErrors((prev) => {
                                            return {
                                                ...prev,
                                                questionName: true
                                            }
                                        })
                                        return
                                    }
                                    setQuestionErrors((prev) => {
                                        return {
                                            ...prev,
                                            questionName: false
                                        }
                                    })
                                }}
                            />
                            {questionErrors.questionName && <span className="form-error-message">Must type a question</span>}

                            <label>Correct answer</label>
                            <input 
                                id="questioncorrectanswer"
                                type='text'
                                className={classNames({'error-input': questionErrors.questionCorrectAnswer})}
                                ref={questionCorrectAnswerRef}
                                onChange={(e)=>{
                                    if (!e.currentTarget.value) {
                                        setQuestionErrors((prev) => {
                                            return {
                                                ...prev,
                                                questionCorrectAnswer: true
                                            }
                                        })
                                        return
                                    }
                                    setQuestionErrors((prev) => {
                                        return {
                                            ...prev,
                                            questionCorrectAnswer: false
                                        }
                                    })
                                }}
                            />
                            {questionErrors.questionCorrectAnswer && <span className="form-error-message">Must give a correct answer</span>}

                            <label>Other alternative</label>
                            <input 
                                id="questionfirstwronganswer"
                                type='text'
                                className={classNames({'error-input': questionErrors.questionFirstWrongAnswer})}
                                ref={questionFirstWrongAnswerRef}
                                onChange={(e)=>{
                                    if (!e.currentTarget.value) {
                                        setQuestionErrors((prev) => {
                                            return {
                                                ...prev,
                                                questionFirstWrongAnswer: true
                                            }
                                        })
                                        return
                                    }
                                    setQuestionErrors((prev) => {
                                        return {
                                            ...prev,
                                            questionFirstWrongAnswer: false
                                        }
                                    })
                                }}
                            />
                            {questionErrors.questionFirstWrongAnswer && <span className="form-error-message">Must type an incorrect answer</span>}

                            <label>Other alternative</label>
                            <input 
                                id="questionsecondwronganswer"
                                type='text'
                                className={classNames({'error-input': questionErrors.questionSecondWrongAnswer})}
                                ref={questionSecondWrongAnswerRef}
                                onChange={(e)=>{
                                    if (!e.currentTarget.value) {
                                        setQuestionErrors((prev) => {
                                            return {
                                                ...prev,
                                                questionSecondWrongAnswer: true
                                            }
                                        })
                                        return
                                    }
                                    setQuestionErrors((prev) => {
                                        return {
                                            ...prev,
                                            questionSecondWrongAnswer: false
                                        }
                                    })
                                }}
                            />
                            {questionErrors.questionSecondWrongAnswer && <span className="form-error-message">Must type an incorrect answer</span>}

                            <label>Other alternative</label>
                            <input 
                                id="questionthirdwronganswer"
                                type='text'
                                className={classNames({'error-input': questionErrors.questionThirdWrongAnswer})}
                                ref={questionThirdWrongAnswerRef}
                                onChange={(e)=>{
                                    if (!e.currentTarget.value) {
                                        setQuestionErrors((prev) => {
                                            return {
                                                ...prev,
                                                questionThirdWrongAnswer: true
                                            }
                                        })
                                        return
                                    }
                                    setQuestionErrors((prev) => {
                                        return {
                                            ...prev,
                                            questionThirdWrongAnswer: false
                                        }
                                    })
                                }}
                            />
                            {questionErrors.questionThirdWrongAnswer && <span className="form-error-message">Must type an incorrect answer</span>}

                            <button
                                className="btn btn-info"
                                disabled={
                                    !questionNameRef.current?.value ||
                                    !questionCorrectAnswerRef.current?.value ||
                                    !questionFirstWrongAnswerRef.current?.value ||
                                    !questionSecondWrongAnswerRef.current?.value ||
                                    !questionThirdWrongAnswerRef.current?.value
                                }
                                onClick={
                                    ()=>{console.log('aeihf')}
                                }
                            >
                                Save
                            </button>

                        </div>
                    )
                }

                <hr />

                {
                    submitErrorMessage && 
                    <p className="submit-error-message">{submitErrorMessage}</p>
                }

                <button type="submit" className="btn btn-info">Publish</button>
            </form>

        </div>
    )
}

export default CreateQuizPage