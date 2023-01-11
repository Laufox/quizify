import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import SearchForm from "../components/SearchForm"
import { useAuthContext } from '../contexts/AuthContext'
import { Quiz } from '../interfaces/Quiz'
import { SearchResults } from '../interfaces/SearchResults'
import { User } from '../interfaces/User'
import defaultAvatar from '../assets/icons/defaultavatar.svg'

const SearchPage = () => {

    // const { query } = useParams()
    const { getAllPublicQuizDocuments, getAllUserDocuments } = useAuthContext()

    const [searchparams, setSearchParams] = useSearchParams()

    const [searchQuery, setSearchQuery] = useState('')
    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [searchResults, setSearchResults] = useState<SearchResults>()

    const handleSearch = (e: any, ref: React.RefObject<HTMLInputElement>) => {

        // Prevent default form behaviour
        e.preventDefault()

        // If no search entry was given, return and do nothing
        if (!ref.current?.value) {
            return
        }

        // Remove trailing whitespace from search entry and save result to variable
        const searchTerm = ref.current.value.trim()

        setSearchParams({query: searchTerm})
        
    }

    const performSearch = async (q: string) => {

        console.log('quizzes:', allQuizzes)
        console.log('users: ', allUsers)

        const quizzes = allQuizzes.filter((quiz) => {

            if (quiz.name.includes(q) || quiz.tags.includes(q)) {
                return true
            }

            return false

        })

        const users = allUsers.filter((user) => {

            if (user.name.includes(q)) {
                return true
            }

            return false

        })
        
        setSearchResults({
            quizzes,
            users
        })

    }

    const applyAllQuizzes = async () => {

        setAllQuizzes([...await getAllPublicQuizDocuments()])

    }

    const applyAllUsers = async () => {

        setAllUsers([...await getAllUserDocuments()])

    }

    useEffect(() => {

        let query = searchparams.get("query")

        if (!query) {
            return
        }

        setSearchQuery(query.trim())

    }, [searchparams])

    useEffect(() => {

        if (!allQuizzes.length || !allUsers.length || !searchQuery) {
            return
        }

        performSearch(searchQuery)

    }, [allQuizzes, allUsers, searchQuery])

    useEffect(() => {

        applyAllQuizzes()
        applyAllUsers()

    }, [])

    useEffect(() => {

        console.log('Results: ', searchResults)

    }, [searchResults])

    return (
        <div className="page-container">
            <h1>Search quizzes and users</h1>
            
            <SearchForm onSearch={handleSearch} defaultValue={searchparams.get("query") ?? ''} />

            {
                searchQuery && (
                    <div className='search-results-container'>
                        <h2>Showing results for "{searchQuery}"</h2>
                    </div>
                )
            }

            {
                !!searchResults?.quizzes.length && (
                    <div className='search-results-container'>
                        <header>
                            <h3>Quizzes</h3>
                        </header>
                        <main>
                        {
                            searchResults.quizzes.map((quiz, i) => (
                                <div key={i} className='search-results-item-quiz'>
                                    <Link to={`/quiz/${quiz.id}`}>{quiz.name}</Link>
                                    <div className='search-results-item-quiz-extras'>
                                        <span>{quiz.category}</span>
                                        <span>{quiz.createdAt}</span>
                                    </div>
                                </div>
                            ))
                        }
                        </main>
                    </div>
                )
            }

            {
                !!searchResults?.users.length && (
                    <div className='search-results-container'>
                        <header>
                            <h3>Users</h3>
                        </header>
                        <main>
                        {
                            searchResults.users.map((user, i) => (
                                <div key={i} className='search-results-item-user'>
                                    <Link 
                                        to={`/profile/${user.id}`} 
                                        className='avatar-container'
                                    >
                                        <img 
                                            src={user.photoURL ? user.photoURL : defaultAvatar} 
                                            alt='avatar-image' 
                                        />
                                        <span>{user.name}</span>
                                    </Link>
                                </div>
                            ))
                        }
                        </main>
                    </div>
                )
            }

        </div>
    )
}

export default SearchPage