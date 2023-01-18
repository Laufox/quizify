import { Link } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import listIcon from '../assets/icons/list-icon.svg'
import defaultAvatar from '../assets/icons/defaultavatar.svg'
import addIcon from '../assets/icons/add-icon.svg'
import PageTransition from "../components/PageTransition"

const UserHomePage = () => {

    const { currentUser } = useAuthContext()

    return (
        <PageTransition>
            <h1>Welcome { currentUser.displayName }!</h1>

            <div className="user-home-page-links">
                <Link to='/quizlist' >
                    <img src={listIcon} />
                    See list of quizzes
                </Link>
                <Link to='/createquiz'>
                    <img src={addIcon} />
                    Create a new quiz
                </Link>
                <Link to={`/profile/${currentUser.uid}`}>
                    <img src={defaultAvatar} />
                    View your profile
                </Link>
            </div>
        </PageTransition>
    )
}

export default UserHomePage