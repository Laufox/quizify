import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import SearchForm from "../components/SearchForm"

const SearchPage = () => {

    // const { query } = useParams()

    const [searchparams, setSearchParams] = useSearchParams()

    const [searchQuery, setSearchQuery] = useState('')

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

    useEffect(() => {

        if (!searchQuery) {
            return
        }

        // Get search result from authContext

    }, [searchQuery])

    useEffect(() => {

        let query = searchparams.get("query")

        if (!query) {
            return
        }

        setSearchQuery(query.trim())

    }, [searchparams])

    return (
        <div className="page-container">
            <h1>Search quizzes and users</h1>
            
            <SearchForm onSearch={handleSearch} defaultValue={searchparams.get("query") ?? ''} />

            {
                searchQuery && (
                    <div className='search-results-container'>
                        <h2>Showing results for {searchQuery}</h2>
                    </div>
                )
            }

        </div>
    )
}

export default SearchPage