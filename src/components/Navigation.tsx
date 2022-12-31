import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import menuOpenIcon from '../assets/icons/menu-open-icon.svg'
import menuCloseIcon from '../assets/icons/menu-close-icon.svg'
import defaultAvatar from '../assets/icons/defaultavatar.svg'
import LinkListGuest from './LinkListGuest'
import LinkListUser from './LinkListUser'
import SearchForm from './SearchForm'

const Navigaion = () => {

    const navigate = useNavigate()

    const { logout, currentUser } = useAuthContext()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

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

    const handleSearch = (e: any, ref: React.RefObject<HTMLInputElement>) => {

        e.preventDefault()

        if (!ref.current?.value) {
            return
        }

        const searchTerm = ref.current.value.trim()
        ref.current.value = ''
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

                    <div className='nav-top-content-wrapper'>

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

                        <SearchForm onSearch={handleSearch} />

                        <div className='menu-toggle' onClick={menuToggle}>
                            <img src={ isMenuOpen ? menuCloseIcon : menuOpenIcon } alt='menu-toggle-icon' />
                        </div>

                    </div>
                    
                </div>
            </div>
            {
                isMenuOpen &&
                <div className='dropdown-content'>
                    <SearchForm onSearch={handleSearch} />

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