// Component that will return a list of links for visitors not signed in

import { Link } from "react-router-dom"

interface Props {
    onNavClick: () => void
}

const LinkListGuest = ({onNavClick} : Props) => {

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
                to='/about'
                onClick={onNavClick}
                className='about-website'
            >
                About website
            </Link>
            <Link 
                to='/signin'
                className="sign-in-link"
                onClick={onNavClick}
            >
                Sign in
            </Link>
            <Link 
                to='/signup'
                className="sign-up-link"
                onClick={onNavClick}
            >
                Sign up
            </Link>
        </nav>
    )
}

export default LinkListGuest