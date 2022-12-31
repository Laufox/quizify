import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import menuOpenIcon from '../assets/icons/menu-open-icon.svg'
import menuCloseIcon from '../assets/icons/menu-close-icon.svg'
import searchIcon from '../assets/icons/search-icon.svg'
import defaultAvatar from '../assets/icons/defaultavatar.svg'
import LinkListGuest from './LinkListGuest'
import LinkListUser from './LinkListUser'

const Navigaion = () => {

    const navigate = useNavigate()

    const { logout, currentUser } = useAuthContext()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const searchInput = useRef<HTMLInputElement>(null)

    const signOut = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error: any) {
            console.log(error?.message)
        }
    }

    const menuToggle = () => {
        setIsMenuOpen(prevState => !prevState)
    }

    const handleSearch = (e: any) => {

        e.preventDefault()

        if (!searchInput.current?.value) {
            return
        }

        const searchTerm = searchInput.current.value.trim()
        searchInput.current.value = ''
        setIsMenuOpen(false)
        navigate(`/search/${searchTerm}`)
        
    }

    return (
        <header className='navigation-header'>
            <div className='nav-top-wrapper'>
            <div className='nav-top'>
                <Link 
                    to='/'
                    onClick={()=>{setIsMenuOpen(false)}}
                >
                    <h1>Quizify</h1>
                </Link>

                {
                    currentUser 
                    ?
                    <LinkListUser onNavClick={()=>{setIsMenuOpen(false)}} signOut={signOut} />
                    :
                    <LinkListGuest onNavClick={()=>{setIsMenuOpen(false)}} />
                }

                {
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

                <form className='search-form' onSubmit={handleSearch} noValidate>
                    <input 
                        type="search" 
                        placeholder='Search...' 
                        ref={searchInput} 
                    />
                    <img 
                        src={searchIcon} 
                        alt='search-button' 
                        role='button' 
                        onClick={handleSearch} 
                        className='search-button'
                    />
                </form>

                <div className='menu-toggle' onClick={menuToggle}>
                    <img src={ isMenuOpen ? menuCloseIcon : menuOpenIcon } alt='menu-toggle-icon' />
                </div>

                {/* 
                    LinkList (d-none on mobile ; d-flex on desktop)
                    Button (d-flex on mobile ; d-none on desktop)
                    Avatar (d-none for guest ; d-flex for user)
                    Search (d-none on mobile ; d-flex on desktop)
                    MenuIcon (d-flex on movbile ; d-none on desktop)
                */}
                {/* <div className='nav-top-icon-wrapper'>
                    {
                        currentUser 
                        ?
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
                        :
                        <Link 
                            to='/signup' 
                            className='btn btn-info'
                            onClick={()=>{setIsMenuOpen(false)}}
                        >
                            Sign up!
                        </Link>
                    }
                    <div className='menu-toggle' onClick={menuToggle}>
                        <img src={ isMenuOpen ? menuCloseIcon : menuOpenIcon } alt='menu-toggle-icon' />
                    </div>
                </div> */}

                {/* <div className='nav-desktop'>
                    {
                        currentUser 
                        ?
                        <LinkListUser onNavClick={()=>{setIsMenuOpen(false)}} signOut={signOut} />
                        :
                        <LinkListGuest onNavClick={()=>{setIsMenuOpen(false)}} />
                    }
                    <div className='nav-top-icon-desktop-wrapper'>
                        {
                            currentUser 
                            ?
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
                            :
                            <Link 
                                to='/signup' 
                                className='btn btn-info'
                                onClick={()=>{setIsMenuOpen(false)}}
                            >
                                Sign up!
                            </Link>
                        }
                        <form className='search-form' onSubmit={handleSearch} noValidate>
                            <input 
                                type="search" 
                                placeholder='Search...' 
                                ref={searchInput} 
                            />
                            <img 
                                src={searchIcon} 
                                alt='search-button' 
                                role='button' 
                                onClick={handleSearch} 
                                className='search-button'
                            />
                        </form>
                    </div>
                </div> */}
            </div>
            </div>
            {
                isMenuOpen &&
                <div className='dropdown-content'>
                    <form className='search-form' onSubmit={handleSearch} noValidate>
                        <input 
                            type="search" 
                            placeholder='Search...' 
                            ref={searchInput} 
                        />
                        <img 
                            src={searchIcon} 
                            alt='search-button' 
                            role='button' 
                            onClick={handleSearch} 
                            className='search-button'
                        />
                    </form>

                    {
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