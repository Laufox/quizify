import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'
import { useAuthContext } from "../contexts/AuthContext"
import { Quiz } from '../interfaces/Quiz'
import { Categories } from '../interfaces/Categories'

import classNames from 'classnames'

const QuizListPage = () => {

    const { getAllPublicQuizDocuments, getAllCategoryDocuments } = useAuthContext()

    const [quizList, setQuizList] = useState<Quiz[]>([])
    const [quizListFiltered, setQuizListFiltered] = useState<Quiz[]>([])
    const [categories, setCategories] = useState<Categories[]>([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    const applyQuizzes = async () => {

        setQuizList([...await getAllPublicQuizDocuments()])

    }

    const applyCategories = async () => {

        setCategories([...await getAllCategoryDocuments()])

    }

    const filterQuizzesByCategory = (category: string) => {

        setSelectedCategory(category)

        let tempFilteredList = !searchTerm ? [...quizList] : [...quizList.filter((quiz) => {

            if (quiz.name.includes(searchTerm) || quiz.tags.includes(searchTerm)) {
                return true
            }

            return false

        })]

        if (category.toLowerCase() === 'all') {
            setQuizListFiltered([...tempFilteredList])
            return
        }

        setQuizListFiltered( [...tempFilteredList.filter((quiz) => quiz.category === category)] )

    }

    const handleSearch = (e: any, ref: React.RefObject<HTMLInputElement>) => {

        // Prevent default form behaviour
        e.preventDefault()

        // Remove trailing whitespace from search entry and save result to variable
        const tempSearchTerm = ref.current?.value ? ref.current.value.trim() : ''

        setSearchTerm(tempSearchTerm)

    }

    useEffect(() => {
        
        filterQuizzesByCategory(selectedCategory)

    }, [searchTerm])

    useEffect(()=>{

        applyQuizzes()
        applyCategories()

    }, [])

    useEffect(()=>{

        setQuizListFiltered([...quizList])

    }, [quizList])

    return (
        <div className="page-container">

            <h1>Public quiz list</h1>

            <SearchForm onSearch={handleSearch} />

            <h2>Filter by category</h2>
            <div className='filterbox-container'>

                <p 
                    className={classNames({
                        'filterbox-item link' : true,
                        'selected': selectedCategory === 'all'
                    })}
                    onClick={()=>{filterQuizzesByCategory('all')}}
                >
                    All
                </p>
                {
                    !!categories.length && categories.map((cat)=>(
                        <p 
                            key={cat.id} 
                            className={classNames({
                                'filterbox-item link' : true,
                                'selected': selectedCategory === cat.name
                            })}
                            onClick={()=>{filterQuizzesByCategory(cat.name)}}
                        >
                            {cat.name}
                        </p>
                    ))
                }

            </div>

            <div className='quizlist-container'>
                <h2>List of quizzes</h2>
                {
                    !!quizListFiltered.length && quizListFiltered.map((quiz)=>(
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