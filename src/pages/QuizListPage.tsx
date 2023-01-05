import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import { useAuthContext } from "../contexts/AuthContext"

interface QuizList {
    id: string, 
    name: string,
    category: string,
    createdAt: string,
    description?: string
}

const QuizListPage = () => {

    const { getAllQuizzes, getCategories } = useAuthContext()

    const [quizList, setQuizList] = useState<QuizList[]>([])
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])

    const applyQuizzes = async () => {

        setQuizList([...await getAllQuizzes()])

    }

    const applyCategories = async () => {
        setCategories([...await getCategories()])
    }

    useEffect(()=>{

        applyQuizzes()
        applyCategories()

    }, [])

    useEffect(()=>{

        console.log(quizList)

    }, [quizList])

    return (
        <div className="page-container">

            <h1>Public quiz list</h1>

            <SearchForm onSearch={()=>{}} />

            <h2>Filter by category</h2>
            <div className='filterbox-container'>

                <p className='filterbox-item link selected'>All</p>
                {
                    !!categories.length && categories.map((cat)=>(
                        <p key={cat.id} className='filterbox-item link'>{cat.name}</p>
                    ))
                }

            </div>

            <div className='quizlist-container'>
                <h2>List of quizzes</h2>
                {
                    !!quizList.length && quizList.map((quiz)=>(
                        <div key={quiz.id} className='quizlist-item'>
                            <header>
                                <Link to={`/quiz/${quiz.id}`}>{quiz.name}</Link>
                                <div className='category-date'>
                                    <span>{quiz.category}</span>
                                    <span>{quiz.createdAt}</span>
                                </div>
                            </header>
                            {
                                quiz.description && (
                                    <main>
                                        <p>{quiz.description}</p>
                                    </main>
                                )
                            }
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default QuizListPage