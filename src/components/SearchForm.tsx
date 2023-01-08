/**
 * 
 * Component for search form
 * 
 **/ 

// React related imports
import { useRef } from 'react'

// Icons to display on website
import searchIcon from '../assets/icons/search-icon.svg'

interface Props {
    onSearch: (e: any, ref: React.RefObject<HTMLInputElement>) => void
}

const SearchForm = ({onSearch} : Props) => {

    // Variable to hold text entered in search input field
    const searchInput = useRef<HTMLInputElement>(null)

    return (
        <form 
            className='search-form' 
            onSubmit={(e)=>{onSearch(e, searchInput)}} 
            noValidate
        >
            <input 
                type="search" 
                placeholder='Search...' 
                className='nav-search'
                ref={searchInput} 
            />
            <img 
                src={searchIcon} 
                alt='search-button' 
                role='button' 
                onClick={(e)=>{onSearch(e, searchInput)}} 
                className='search-button'
            />
        </form>
    )
}

export default SearchForm