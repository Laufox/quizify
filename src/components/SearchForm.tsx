import { useRef } from 'react'
import searchIcon from '../assets/icons/search-icon.svg'

interface Props {
    onSearch: (e: any, ref: React.RefObject<HTMLInputElement>) => void
}

const SearchForm = ({onSearch} : Props) => {

    const searchInput = useRef<HTMLInputElement>(null)

    return (
        <form className='search-form' onSubmit={(e)=>{onSearch(e, searchInput)}} noValidate>
            <input 
                type="search" 
                placeholder='Search...' 
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