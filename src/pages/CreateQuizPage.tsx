import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"

import accordionIcon from '../assets/icons/accordion-icon.svg'
import NewQuestionForm from "../components/NewQuestionForm"
import EditQuestionForm from "../components/EditQuestionForm"
import { FormData } from "../interfaces/FormData"
import { NewQuestionItem } from "../interfaces/NewQuestionItem"
import { Categories } from "../interfaces/Categories"
import { NewQuestionInput } from "../interfaces/NewQuestionInput"
import LoadingSpinnerButton from "../components/LoadingSpinnerButton"
import { useNavigate } from "react-router-dom"
import Alert from "../components/Alert"

const CreateQuizPage = () => {

    const navigate = useNavigate()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // Funtions and variabels to use from auth context
    const { createQuizDocument, getAllCategoryDocuments, loading } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState('')
    const [questionAddedToShow, setQuestionAddedToShow] = useState(-1)
    const [questionsList, setQuestionsList] = useState<NewQuestionItem[]>([])
    const [categories, setCategories] = useState<Categories[]>([])
    const [firebaseError, setFirebaseError] = useState('')

    const submitQuiz = async (data: FormData) => {

        setSubmitErrorMessage('')

        if (data.description) {
            data.description = data.description.trim()
        }

        if (data.tags && typeof data.tags === "string") {
            data.tags = data.tags.trim().split(' ')
        }

        const response = await createQuizDocument({
            ...data,
            name: data.quizname.trim(),
            questions: questionsList
        })

        if (!response.success) {

            setSubmitErrorMessage(response?.error?.message ?? 'An unknown error occured')
            return

        }

        navigate(`/quiz/${response.quizId}`)

    }

    const addNewQuestion = (question: NewQuestionInput) => {

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

    const editQuestion = (index: number, updatedQuestion: NewQuestionInput) => {

        if (
            !updatedQuestion.question ||
            !updatedQuestion.correctAnswer ||
            !updatedQuestion.firstWrongAnswer ||
            !updatedQuestion.secondWrongAnswer ||
            !updatedQuestion.thirdWrongAnswer
        ) {
            return
        }

        const newQuestionArray = [...questionsList]

        newQuestionArray[index].questionText = updatedQuestion.question

        newQuestionArray[index].answers[0].text = updatedQuestion.correctAnswer
        newQuestionArray[index].answers[1].text = updatedQuestion.firstWrongAnswer
        newQuestionArray[index].answers[2].text = updatedQuestion.secondWrongAnswer
        newQuestionArray[index].answers[3].text = updatedQuestion.thirdWrongAnswer

        setQuestionsList([...newQuestionArray])
        setQuestionAddedToShow(-1)

    }

    const deleteQuestion = (index: number) => {

        const newArr = [...questionsList]
        newArr.splice(index, 1)
        setQuestionsList( [...newArr] )

        setQuestionAddedToShow(-1)

    }

    const applyCategories = async () => {

        const response = await getAllCategoryDocuments()

        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return
        }

        setCategories([...response.categories])
        
    }

    useEffect(()=>{

        applyCategories()

    }, [])

    return (
        <div className="page-container">

            <h1>Create new quiz</h1>

            <form onSubmit={handleSubmit(submitQuiz)} noValidate>

                <h2>Info</h2>

                <label htmlFor="quizname">Quiz name *</label>
                <input 
                    id="quizname" 
                    type='text' 
                    {...register('quizname', {
                        required: 'Name of quiz is required'
                    })}
                    placeholder='name'
                    className={classNames({'error-input': errors.quizname})}
                />
                {errors.quizname && <span className="form-error-message">{errors.quizname?.message}</span>}

                <label htmlFor="quizcategory">Category *</label>
                <select
                    id="quizcategory" 
                    {...register('category', {
                        required: 'Must choose category'
                    })}
                    placeholder='category'
                    className={classNames({'error-input': errors.category})}
                >
                    <option value="" hidden>--Select a category--</option>
                    {
                        !!categories.length && categories.map((cat, i)=>(
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))
                    }
                </select>
                {errors.category && <span className="form-error-message">{errors.category?.message}</span>}

                <label htmlFor="quizdesc">Description</label>
                <textarea
                    id="quizdesc"  
                    {...register('description')}
                    placeholder='description'
                    className={classNames({'error-input': errors.description})}
                    rows={3}
                />
                {errors.description && <span className="form-error-message">{errors.description?.message}</span>}

                <label htmlFor="quiztags">Tags (seperate each one with space)</label>
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
                    Public (searchable for everyone)
                </label>
                <label className="radio-input-label">
                    <input 
                        id="quizvispublic"
                        type='radio'
                        {...register('visibility')}
                        value='private'
                    />
                    Private (only reachable by link)
                </label>

                <hr className="hr-create-question-form" />

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
                            <header 
                                onClick={()=>{
                                    toggleEditQuestionForm(i)
                                }}
                                className={questionAddedToShow === i ? 'header-open': 'header-closed'}
                            >
                                <div className="question-number-text">
                                    <span>#{i+1}</span>
                                    <h3>{question.questionText}</h3>
                                </div>
                                <img src={accordionIcon} alt='icon to see question' />
                            </header>

                            {
                                questionAddedToShow === i && 

                                <EditQuestionForm 
                                    question={questionsList[questionAddedToShow]} 
                                    onEdit={(updatedQuestion)=>{editQuestion(i, updatedQuestion)}} 
                                    onDelete={()=>{deleteQuestion(i)}}
                                />
                                
                            }
                        </div>
                    ))
                }

                <hr className="hr-create-question-form" />

                {
                    submitErrorMessage && 
                    <p className="submit-error-message">{submitErrorMessage}</p>
                }

                <button 
                    type="submit" 
                    className={classNames({
                        'btn': true,
                        'btn-info': true,
                        'btn-action': true,
                        'btn-create-quiz': true,
                        'btn-disabled': !questionsList.length || loading.createQuiz
                    })}
                    disabled={!questionsList.length || loading.createQuiz}
                >
                    {
                        loading.createQuiz ? (
                            <LoadingSpinnerButton />
                        ) : (
                            'Publish'
                        )
                    }
                </button>
                {
                    !questionsList.length &&
                    <span>(Must add at least one quiz)</span>
                }
            </form>

            {
                firebaseError && (
                    <Alert
                        onCancel={()=>{setFirebaseError('')}}
                        message={firebaseError}
                    />
                )
            }

        </div>
    )
}

export default CreateQuizPage