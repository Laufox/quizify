import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import defaultAvatar from '../assets/icons/defaultavatar.svg'
import accordionIcon from '../assets/icons/accordion-icon.svg'

interface userData {
    uid: string,
    username: string,
    photoURL: string
}

const ProfilePage = () => {

    const { currentUser, getUser } = useAuthContext()
    const { uid } = useParams()

    const [userData, setUserData] = useState<userData>()
    const [showCreated, setShowCreated] = useState(false)
    const [showPlayed, setShowPlayed] = useState(false)

    const toggleShowCreated = () => {
        setShowCreated( prevState => !prevState )
    }

    const toggleShowPlayed = () => {
        setShowPlayed( prevState => !prevState )
    }

    useEffect(()=>{

        const asyncFunction = async () => {
            try {
                setUserData(await getUser(uid))
            } catch (error) {
                console.log(error)
            }
        }

        if (uid) {
            asyncFunction()
        }

    }, [uid])

    return (
        <div className="page-container">

            {
                userData && (

                    <>
                    <div className="profile-info">
                        <div className="profile-avatar-container">
                            <img src={userData.photoURL ? userData.photoURL : defaultAvatar} alt='avatar-image-preview' className="avatar-image-preview" />
                        </div>
                        <h1>{ userData.username }</h1>
                        {
                            userData.uid === currentUser.uid &&
                            <Link to={`/updateprofile/${userData.uid}`}>Update profile</Link>
                        }
                    </div>


                    <div className='created-quizzes'>
                        <header>
                            <h2>Your created quizzes</h2>
                            <img 
                                src={accordionIcon} 
                                onClick={toggleShowCreated}
                            />
                        </header>

                        {
                            showCreated && (
                                <main className='created-quizzes-collection'>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <Link to='' className='new-quiz-link'>+ New quiz</Link>
                                </main>
                            )
                        }
                        

                    </div>

                    <div className='played-quizzes'>
                        <header>
                            <h2>Your last played quizzes</h2>
                            <img 
                                src={accordionIcon} 
                                onClick={toggleShowPlayed}
                            />
                        </header>

                        {
                            showPlayed && (
                                <main className='played-quizzes-collection'>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <Link to='' className='new-quiz-link'>+ New quiz</Link>
                                </main>
                            )
                        }

                        
                    </div>
                    </>

                )
            }

        </div>
    )
}

export default ProfilePage