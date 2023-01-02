import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import defaultAvatar from '../assets/icons/defaultavatar.svg'

interface userData {
    uid: string,
    username: string,
    photoURL: string
}

const ProfilePage = () => {

    const { currentUser, getUser } = useAuthContext()
    const { uid } = useParams()

    const [userData, setUserData] = useState<userData>()

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
                        <div className="form-avatar-container">
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
                            <p>d</p>
                        </header>

                        <main className='created-quizzes-collection'>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <div className='action-links'>
                                    <Link to=''>Update</Link>
                                    <Link to=''>Delete</Link>
                                </div>
                            </div>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <div className='action-links'>
                                    <Link to=''>Update</Link>
                                    <Link to=''>Delete</Link>
                                </div>
                            </div>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <div className='action-links'>
                                    <Link to=''>Update</Link>
                                    <Link to=''>Delete</Link>
                                </div>
                            </div>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <div className='action-links'>
                                    <Link to=''>Update</Link>
                                    <Link to=''>Delete</Link>
                                </div>
                            </div>
                            <Link to=''>+ New quiz</Link>
                        </main>

                    </div>

                    <div className='played-quizzes'>
                        <header>
                            <h2>Your last played quizzes</h2>
                            <p>d</p>
                        </header>

                        <main className='created-quizzes-collection'>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <span>score%</span>
                            </div>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <span>score%</span>
                            </div>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <span>score%</span>
                            </div>
                            <div>
                                <Link to=''>Quiz title</Link>
                                <span>score%</span>
                            </div>
                            <Link to=''>+ New quiz</Link>
                        </main>
                    </div>
                    </>

                )
            }

        </div>
    )
}

export default ProfilePage