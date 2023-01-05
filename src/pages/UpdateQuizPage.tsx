import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"

import accordionIcon from '../assets/icons/accordion-icon.svg'
import NewQuestionForm from "../components/NewQuestionForm"
import EditQuestionForm from "../components/EditQuestionForm"
import Confirm from "../components/Confirm"

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

interface quiz {
    authorId: string,
    authorName: string,
    category: string,
    createdAt: string,
    description: string,
    name: string,
    questions: newQuestionInterface[],
    tags: string[],
    visibility: string
}

const UpdateQuizPage = () => {

    const { id } = useParams()

    const navigate = useNavigate()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // Funtions and variabels to use from auth context
    const { updateQuiz, getCategories, getOneQuiz, removeQuiz, currentUser } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState()
    const [questionAddedToShow, setQuestionAddedToShow] = useState(-1)
    const [questionsList, setQuestionsList] = useState<newQuestionInterface[]>([])
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])

    const [quiz, setQuiz] = useState<quiz>()

    const [openConfirm, setOpenConfirm] = useState(false)

    const submitQuiz = async (data: any) => {

        if (data.description) {
            data.description = data.description.trim()
        }

        if (data.tags) {
            data.tags = data.tags.trim().split(' ')
        }
        
        try {
            await updateQuiz({
                ...data,
                name: data.name.trim(),
                questions: questionsList
            }, id)
            navigate(`/quiz/${id}`)
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

    const applyCategories = async () => {
        setCategories([...await getCategories()])
    }

    const applyQuiz = async () => {

        setQuiz(await getOneQuiz(id))

    }

    const applyQuestions = () => {

        console.log(quiz?.questions)
        if (!quiz){
            return
        }
        setQuestionsList([...quiz.questions])

    }

    const openConfirmModal = () => {
        setOpenConfirm(true)
    }

    const closeConfirmModal = () => {
        setOpenConfirm(false)
    }

    const handleDeleteQuiz = async () => {

        try {
            await removeQuiz(id)
            closeConfirmModal()
            navigate('/')
        } catch (error) {
            console.log(error)
        }

    }

    useEffect(()=>{

        applyCategories()

    }, [])

    useEffect(()=>{

        if (id) {
            applyQuiz()
        }

    }, [id])

    useEffect(()=>{

        if (quiz) {

            if (quiz.authorId !== currentUser.uid) {
                navigate('/')
                return
            }

            applyQuestions()
        }

    }, [quiz])

    return (
        <div className="page-container">

            <h1>Update quiz</h1>

            {
                quiz && currentUser.uid === quiz.authorId && (
                    <>
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
                            defaultValue={quiz.name}
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
                            defaultValue={quiz.category}
                        >
                            <option value="" hidden>--Select a category--</option>
                            {
                                !!categories.length && categories.map((cat, i)=>(
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))
                            }
                        </select>
                        {errors.category && <span className="form-error-message">{errors.category?.message}</span>}

                        <label>Description</label>
                        <textarea
                            id="quizdesc"  
                            {...register('description')}
                            placeholder='description'
                            className={classNames({'error-input': errors.description})}
                            rows={3}
                            defaultValue={quiz.description}
                        />
                        {errors.description && <span className="form-error-message">{errors.description?.message}</span>}

                        <label>Tags (seperate each one with space)</label>
                        <textarea 
                            id="quiztags"
                            {...register('tags')}
                            placeholder='tags'
                            className={classNames({'error-input': errors.tags})}
                            rows={2}
                            defaultValue={quiz.tags ? quiz.tags.join(' ') : ''}
                        />
                        {errors.tags && <span className="form-error-message">{errors.tags?.message}</span>}

                        <label>Visibility</label>

                        <label className="radio-input-label">
                            <input 
                                id="quizvispublic"
                                type='radio'
                                {...register('visibility')}
                                value='public'
                                defaultChecked={quiz.visibility === 'public'}
                            />
                            Public
                        </label>
                        <label className="radio-input-label">
                            <input 
                                id="quizvisprivate"
                                type='radio'
                                {...register('visibility')}
                                value='private'
                                defaultChecked={quiz.visibility === 'private'}
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

                    <hr />
                    <div className='danger-zone'>
                        <h2>Danger zone</h2>
                        <button 
                            className='btn btn-danger' 
                            onClick={openConfirmModal}
                        >Delete quiz</button>
                    </div>
                    </>
                )
            }            

            {
                openConfirm &&
                <Confirm 
                    onConfirm={handleDeleteQuiz}
                    onCancel={closeConfirmModal}
                    actionText='You are about to delete this quiz'
                    requiresAuth={false}
                />
            }

        </div>
    )
}

export default UpdateQuizPage