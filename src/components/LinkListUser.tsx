// Component that will return a list of links for users that are signed in

import { Link } from "react-router-dom"
import { useAuthContext } from '../contexts/AuthContext'

interface Props {
    onNavClick: () => void,
    signOut: () => void
}

const LinkListUser = ({onNavClick, signOut} : Props) => {

    const { currentUser } = useAuthContext()

    return (
        <nav className='link-collection'>
            <Link 
                to='/quizlist'
                onClick={onNavClick}
                className='view-quiz-list'
            >
                View quiz list
            </Link>
            <Link 
                to='/createquiz'
                onClick={onNavClick}
                className='create-a-quiz'
            >
                Create a quiz
            </Link>
            <Link 
                to='/about'
                onClick={onNavClick}
                className='about-website'
            >
                About website
            </Link>
            <Link 
                to={`/profile/${currentUser.uid}`}
                className='profile-page-link'
                onClick={onNavClick}
            >
                Profile page
            </Link>
            <p 
                className='link sign-out-link'
                onClick={()=>{
                    onNavClick()
                    signOut()
                }}
            >
                logout
            </p>
        </nav>
    )
}

export default LinkListUser