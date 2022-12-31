import { Link } from "react-router-dom"
import { useAuthContext } from '../contexts/AuthContext'

interface Props {
    onNavClick: () => void,
    signOut: () => void
}

const LinkListUser = ({onNavClick, signOut} : Props) => {

    const { logout, currentUser } = useAuthContext()

    return (
        <nav className='link-collection'>
            <Link 
                to='/quizlist'
                onClick={onNavClick}
            >
                View quiz list
            </Link>
            <Link 
                to='/createquiz'
                onClick={onNavClick}
            >
                Create a quiz
            </Link>
            <Link 
                to={`/profile/${currentUser.uid}`}
                onClick={onNavClick}
            >
                Sign in
            </Link>
            <p 
                className='link' 
                onClick={()=>{
                    onNavClick()
                    signOut()
                }}
            >
                logout
            </p>
            <Link 
                to='/about'
                onClick={onNavClick}
            >
                About website
            </Link>
        </nav>
    )
}

export default LinkListUser