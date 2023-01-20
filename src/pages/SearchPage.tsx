import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import SearchForm from "../components/SearchForm"
import { useAuthContext } from '../contexts/AuthContext'
import { Quiz } from '../interfaces/Quiz'
import { SearchResults } from '../interfaces/SearchResults'
import { User } from '../interfaces/User'
import defaultAvatar from '../assets/icons/defaultavatar.svg'
import Alert from '../components/Alert'
import Pagination from '../components/Pagination'
import PageTransition from '../components/PageTransition'

const SearchPage = () => {

    // const { query } = useParams()
    const { getAllPublicQuizDocuments, getAllUserDocuments } = useAuthContext()

    const [searchparams, setSearchParams] = useSearchParams()

    const [searchQuery, setSearchQuery] = useState('')
    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [searchResults, setSearchResults] = useState<SearchResults>()
    const [firebaseError, setFirebaseError] = useState('')
    const [currentPageUsers, setCurrentPageUsers] = useState(1)
    const [currentPageQuizzes, setCurrentPageQuizzes] = useState(1)

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

        const quizzes = allQuizzes.filter((quiz) => {

            if (quiz.name.toLowerCase().includes(q.toLowerCase()) || quiz.tags.includes(q.toLowerCase())) {
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

        const response = await getAllPublicQuizDocuments()

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return

        }

        setAllQuizzes([...response.quizzes])

    }

    const applyAllUsers = async () => {

        const response = await getAllUserDocuments()

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return

        }

        setAllUsers([...await response.users])

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

    return (
        <PageTransition>
            <h1>Search quizzes and users</h1>
            
            <SearchForm onSearch={handleSearch} defaultValue={searchparams.get("query") ?? ''} />

            <>
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
                            searchResults.quizzes.length > 10 && (
                                <Pagination
                                    items={searchResults.quizzes}
                                    currentPage={currentPageQuizzes}
                                    onPageSwitch={(page: number)=>{setCurrentPageQuizzes(page)}}
                                />
                            )
                        }
                        {
                            searchResults.quizzes.slice(currentPageQuizzes*10-10, currentPageQuizzes*10).map((quiz, i) => (
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
                            searchResults.users.length > 10 && (
                                <Pagination
                                    items={searchResults.users}
                                    currentPage={currentPageUsers}
                                    onPageSwitch={(page: number)=>{setCurrentPageUsers(page)}}
                                />
                            )
                        }
                        {
                            searchResults.users.slice(currentPageUsers*10-10, currentPageUsers*10).map((user, i) => (
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

            {
                firebaseError && (
                    <Alert
                        onCancel={()=>{setFirebaseError('')}}
                        message={firebaseError}
                    />
                )
            }
            </>

        </PageTransition>
    )
}

export default SearchPage