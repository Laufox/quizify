/**
 * 
 * Content and functionality for navigation/header part of website
 * 
 **/ 

// React related imports
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

// Icons to display on website
import menuOpenIcon from '../assets/icons/menu-open-icon.svg'
import menuCloseIcon from '../assets/icons/menu-close-icon.svg'
import defaultAvatar from '../assets/icons/defaultavatar.svg'

// Components for various page elements
import LinkListGuest from './LinkListGuest'
import LinkListUser from './LinkListUser'
import SearchForm from './SearchForm'

const Navigaion = () => {

    // Function to jump to different page route
    const navigate = useNavigate()

    // Funtions and variabels to use from auth context
    const { logout, currentUser } = useAuthContext()

    // State for if the dropdown content on smaller screens are open or not
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Funtcion to request to sign out the signed in user
    const signOut = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error: any) {
            console.log(error?.message)
        }
    }

    // If dropdown menu is open, hide it. Otherwise show it
    const menuToggle = () => {
        setIsMenuOpen(prevState => !prevState)
    }

    // When Navigation search form is submitted
    const handleSearch = (e: any, ref: React.RefObject<HTMLInputElement>) => {

        // Prevent default form behaviour
        e.preventDefault()

        // If no search entry was given, return and do nothing
        if (!ref.current?.value) {
            return
        }

        // Remove trailing whitespace from search entry and save result to variable
        const searchTerm = ref.current.value.trim()
        // Empty search input field
        ref.current.value = ''
        // Close dropdown menu
        setIsMenuOpen(false)
        // Go to search page
        navigate(`/search/${searchTerm}`)
        
    }

    return (
        <header className='navigation-header'>
            <div className='nav-top-wrapper'>
                <div className='nav-top'>
                    <Link 
                        to='/'
                        onClick={()=>{setIsMenuOpen(false)}}
                        className='nav-logo-link'
                    >
                        Quizify
                    </Link>

                    <div className='nav-top-content-wrapper'>

                        {
                            // Show different nav links dependent on if there is a signed in user or not
                            currentUser 
                            ?
                            <LinkListUser onNavClick={()=>{setIsMenuOpen(false)}} signOut={signOut} />
                            :
                            <LinkListGuest onNavClick={()=>{setIsMenuOpen(false)}} />
                        }

                        {
                            // Only show sign up button if no user is signed in
                            !currentUser
                            &&
                            <Link 
                                to='/signup' 
                                className='btn btn-info'
                                onClick={()=>{setIsMenuOpen(false)}}
                            >
                                Sign up!
                            </Link>
                        }

                        {
                            // Only show profile avatar if user is signed in
                            currentUser 
                            &&
                            <Link 
                                to={`/profile/${currentUser.uid}`} 
                                className='nav-avatar-container'
                                onClick={()=>{setIsMenuOpen(false)}}
                            >
                                <img 
                                    src={currentUser.photoURL ? currentUser.photoURL : defaultAvatar} 
                                    alt='nav-avatar-image' 
                                />
                            </Link>
                        }

                        <SearchForm onSearch={handleSearch} />

                        <div className='menu-toggle' onClick={menuToggle}>
                            <img src={ isMenuOpen ? menuCloseIcon : menuOpenIcon } alt='menu-toggle-icon' />
                        </div>

                    </div>
                    
                </div>
            </div>
            {
                // Only show dropdown - content if menu has been opened
                isMenuOpen &&
                <div className='dropdown-content'>
                    <SearchForm onSearch={handleSearch} />

                    {
                        // Show different nav links dependent on if there is a signed in user or not
                        currentUser 
                        ?
                        <LinkListUser onNavClick={()=>{setIsMenuOpen(false)}} signOut={signOut} />
                        :
                        <LinkListGuest onNavClick={()=>{setIsMenuOpen(false)}} />
                    }
                </div>
            }
            
            
        </header>
    )
}

export default Navigaion