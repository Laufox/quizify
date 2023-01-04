import { useState } from "react"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"

import accordionIcon from '../assets/icons/accordion-icon.svg'
import NewQuestionForm from "../components/NewQuestionForm"
import EditQuestionForm from "../components/EditQuestionForm"

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

    const editQuestion = (index: number, updatedQuestion: NewQuestionInputObject) => {

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
                                questionAddedToShow === i && 

                                <EditQuestionForm 
                                    question={questionsList[questionAddedToShow]} 
                                    onEdit={(updatedQuestion)=>{editQuestion(i, updatedQuestion)}} onDelete={()=>{deleteQuestion(i)}}
                                />
                                
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