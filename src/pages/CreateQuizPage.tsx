import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"

import accordionIcon from '../assets/icons/accordion-icon.svg'
import NewQuestionForm from "../components/NewQuestionForm"

interface NewQuestionInputObject {
    question: string,
    correctAnswer: string,
    firstWrongAnswer: string,
    secondWrongAnswer: string,
    thirdWrongAnswer: string
}

interface newQuestionInterface {
    questionText: string,
    answers: {
        isCorrect: boolean,
        text: string
    }[]
}

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
    const [questionAddedToShow, setQuestionAddedToShow] = useState(-1)
    const [questionsList, setQuestionsList] = useState<newQuestionInterface[]>([])

    const editQuestionNameRef = useRef<HTMLInputElement>(null)
    const editQuestionCorrectAnswerRef = useRef<HTMLInputElement>(null)
    const editQuestionFirstWrongAnswerRef = useRef<HTMLInputElement>(null)
    const editQuestionSecondWrongAnswerRef = useRef<HTMLInputElement>(null)
    const editQuestionThirdWrongAnswerRef = useRef<HTMLInputElement>(null)

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
                name: data.name.trim(),
                questions: questionsList
            })
        } catch (error: any) {
            setSubmitErrorMessage(error?.message)
        }

    }

    const addNewQuestion = (question: NewQuestionInputObject) => {

        setQuestionsList( [...questionsList, {
            questionText: question.question,
            answers: [
                {
                    isCorrect: true,
                    text: question.correctAnswer
                },
                {
                    isCorrect: false,
                    text: question.firstWrongAnswer
                },
                {
                    isCorrect: false,
                    text: question.secondWrongAnswer
                },
                {
                    isCorrect: false,
                    text: question.thirdWrongAnswer
                }
            ]
        }] )

    }

    const toggleEditQuestionForm = (index: number) => {

        if (index === questionAddedToShow) {
            setQuestionAddedToShow(-1)
            return
        }

        setQuestionAddedToShow(index)

    }

    const editQuestion = (index: number) => {

        if (
            !editQuestionNameRef.current?.value ||
            !editQuestionCorrectAnswerRef.current?.value ||
            !editQuestionFirstWrongAnswerRef.current?.value ||
            !editQuestionSecondWrongAnswerRef.current?.value ||
            !editQuestionThirdWrongAnswerRef.current?.value
        ) {
            return
        }

        const newQuestionArray = [...questionsList]

        newQuestionArray[index].questionText = editQuestionNameRef.current.value

        newQuestionArray[index].answers[0].text = editQuestionCorrectAnswerRef.current.value
        newQuestionArray[index].answers[1].text = editQuestionFirstWrongAnswerRef.current.value
        newQuestionArray[index].answers[2].text = editQuestionSecondWrongAnswerRef.current.value
        newQuestionArray[index].answers[3].text = editQuestionThirdWrongAnswerRef.current.value

        setQuestionsList([...newQuestionArray])
        setQuestionAddedToShow(-1)

    }

    const deleteQuestion = (index: number) => {

        const newArr = [...questionsList]
        newArr.splice(index, 1)
        setQuestionsList( [...newArr] )

    }

    useEffect(()=>{

        console.log('this is current questions: ', questionsList)

    }, [questionsList])

    useEffect(()=> {

        if (questionAddedToShow !== -1) {

            console.log('inside')

            if (
                !editQuestionNameRef.current ||
                !editQuestionCorrectAnswerRef.current ||
                !editQuestionFirstWrongAnswerRef.current ||
                !editQuestionSecondWrongAnswerRef.current ||
                !editQuestionThirdWrongAnswerRef.current
            ) {
                console.log('hello')
                return
            }
            console.log(questionsList[questionAddedToShow].questionText)
            console.log(editQuestionNameRef.current.value)
            editQuestionNameRef.current.value = questionsList[questionAddedToShow].questionText
            editQuestionCorrectAnswerRef.current.value = questionsList[questionAddedToShow].answers[0].text
            editQuestionFirstWrongAnswerRef.current.value = questionsList[questionAddedToShow].answers[1].text
            editQuestionSecondWrongAnswerRef.current.value = questionsList[questionAddedToShow].answers[2].text
            editQuestionThirdWrongAnswerRef.current.value = questionsList[questionAddedToShow].answers[3].text
            console.log(editQuestionNameRef.current.value)
        }

    }, [questionAddedToShow])

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
                    rows={3}
                />
                {errors.description && <span className="form-error-message">{errors.description?.message}</span>}

                <label>Tags (seperate each one with space)</label>
                <textarea 
                    id="quiztags"
                    {...register('tags')}
                    placeholder='tags'
                    className={classNames({'error-input': errors.tags})}
                    rows={2}
                />
                {errors.tags && <span className="form-error-message">{errors.tags?.message}</span>}

                <label>Visibility</label>

                <label className="radio-input-label">
                    <input 
                        id="quizvispublic"
                        type='radio'
                        {...register('visibility')}
                        value='public'
                        defaultChecked
                    />
                    Public
                </label>
                <label className="radio-input-label">
                    <input 
                        id="quizvispublic"
                        type='radio'
                        {...register('visibility')}
                        value='private'
                    />
                    Private
                </label>

                <hr />

                <h2>Questions</h2>
               
                <NewQuestionForm onAddNewQuestion={addNewQuestion} />
                    
                {
                    !!questionsList.length && (
                        <h3 className="current-added-questions">Current added questions:</h3>
                    )
                }

                {
                    !!questionsList.length && questionsList.map((question, i) => (
                        <div className="question-container" key={i}>
                            <header onClick={()=>{
                                    toggleEditQuestionForm(i)
                                }}>
                                <div className="question-number-text">
                                    <span>#{i+1}</span>
                                    <h3>{question.questionText}</h3>
                                </div>
                                <img src={accordionIcon} alt='icon to see question' />
                            </header>

                            {
                                questionAddedToShow === i && (

                                    <main className="new-question-form">
                                        <label>Question</label>
                                        <input 
                                            type='text'
                                            defaultValue={question.questionText}
                                            ref={editQuestionNameRef}
                                            onKeyDown={(e)=>{
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                }
                                            }}
                                        />

                                        <label>Correct answer</label>
                                        <input 
                                            type='text'
                                            // defaultValue={question.answers[0].text}
                                            ref={editQuestionCorrectAnswerRef}
                                            onKeyDown={(e)=>{
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                }
                                            }}
                                        />

                                        <label>Other alternative</label>
                                        <input 
                                            type='text'
                                            // defaultValue={question.answers[1].text}
                                            ref={editQuestionFirstWrongAnswerRef}
                                            onKeyDown={(e)=>{
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                }
                                            }}
                                        />

                                        <label>Other alternative</label>
                                        <input 
                                            type='text'
                                            // defaultValue={question.answers[2].text}
                                            ref={editQuestionSecondWrongAnswerRef}
                                            onKeyDown={(e)=>{
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                }
                                            }}
                                        />

                                        <label>Other alternative</label>
                                        <input 
                                            type='text'
                                            // defaultValue={question.answers[3].text}
                                            ref={editQuestionThirdWrongAnswerRef}
                                            onKeyDown={(e)=>{
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                }
                                            }}
                                        />

                                        <div className="action-btn-container">
                                            <button
                                                type="button"
                                                className='btn btn-info'
                                                onClick={()=>{editQuestion(i)}}
                                            >
                                                Save
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={()=>{deleteQuestion(i)}}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </main>

                                )
                            }
                        </div>
                    ))
                }

                <hr />

                {
                    submitErrorMessage && 
                    <p className="submit-error-message">{submitErrorMessage}</p>
                }

                <button 
                    type="submit" 
                    className={classNames({
                        'btn': true,
                        'btn-info': true,
                        'btn-disabled': !questionsList.length
                    })}
                    disabled={!questionsList.length}
                >
                    Publish
                </button>
                {
                    !questionsList.length &&
                    <span>(Must add at least one quiz)</span>
                }
            </form>

        </div>
    )
}

export default CreateQuizPage