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
            >
                View quiz list
            </Link>
            <Link 
                to='/signup'
                onClick={onNavClick}
            >
                Sign up
            </Link>
            <Link 
                to='/signin'
                onClick={onNavClick}
            >
                Sign in
            </Link>
            <Link 
                to='/about'
                onClick={onNavClick}
            >
                About website
            </Link>
        </nav>
    )
}

export default LinkListGuest