import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import defaultAvatar from '../assets/icons/defaultavatar.svg'
import accordionIcon from '../assets/icons/accordion-icon.svg'
import SearchForm from '../components/SearchForm'

interface userData {
    uid: string,
    username: string,
    photoURL: string,
    role: string
}

const ProfilePage = () => {

    const { currentUser, getUser, getCategories, createCategorie, deleteCategorie } = useAuthContext()
    const { uid } = useParams()

    const [userData, setUserData] = useState<userData>()
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])
    const [showCreated, setShowCreated] = useState(false)
    const [showPlayed, setShowPlayed] = useState(false)
    const [showAddedQuizzes, setShowAddedQuizzes] = useState(false)
    const [showAddedUsers, setShowAddedUsers] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
    const [newCategorieInput, setNewCategorieInput] = useState('')

    const toggleShowCreated = () => {
        setShowCreated( prevState => !prevState )
    }

    const toggleShowPlayed = () => {
        setShowPlayed( prevState => !prevState )
    }

    const toggleShowAddedQuizzes = () => {
        setShowAddedQuizzes( prevState => !prevState )
    }

    const toggleShowAddedUsers = () => {
        setShowAddedUsers( prevState => !prevState )
    }

    const toggleShowCategories = () => {
        setShowCategories( prevState => !prevState )
    }

    const addNewCategorie = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!newCategorieInput) {
            return
        }

        try {
            await createCategorie(newCategorieInput)
            applyCategories()
            setNewCategorieInput('')
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleDeleteCategorie = async (id: string) => {
        
        try {
            await deleteCategorie(id)
            applyCategories()
        } catch (error) {
            console.log(error)
        }
        
    }
    
    const applyCategories = async () => {
        setCategories([...await getCategories()])
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

    useEffect(()=>{

        

        if (userData?.role === "admin") {
            applyCategories()
        }
        
    }, [userData])

    useEffect(()=>{
        console.log('here are categories: ', categories)
    }, [categories])

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
                        <header onClick={toggleShowCreated}>
                            <h2>Your created quizzes</h2>
                            <img src={accordionIcon}/>
                        </header>

                        {
                            showCreated && (
                                <main className='created-quizzes-collection'>
                                    <div className='created-quiz-item'>
                                        <Link to=''>2022-12-24 - Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Date created - Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Date created - Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    <div className='created-quiz-item'>
                                        <Link to=''>Date created - Quiz title</Link>
                                        <div className='action-links'>
                                            <Link to=''>Update</Link>
                                            <Link to=''>Delete</Link>
                                        </div>
                                    </div>
                                    {/* Only show if this is signed in user */}
                                    <Link to='' className='new-quiz-link'>+ New quiz</Link>
                                </main>
                            )
                        }
                        
                    </div>

                    <div className='played-quizzes'>
                        <header onClick={toggleShowPlayed} >
                            <h2>Your last played quizzes</h2>
                            <img src={accordionIcon}/>
                        </header>

                        {
                            showPlayed && (
                                <main className='played-quizzes-collection'>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Date played - Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Date played - Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Date played - Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                    <div className='played-quiz-item'>
                                        <Link to=''>Date played - Quiz title</Link>
                                        <span>score%</span>
                                    </div>
                                </main>
                            )
                        }

                        
                    </div>

                    {
                        userData.role === "admin" && (
                            <div className='admin-panel'>

                                <hr />

                                <h2>Admin control</h2>

                                <SearchForm onSearch={()=>{}} />

                                <div className='created-quizzes'>
                                    <header onClick={toggleShowAddedQuizzes}>
                                        <h2>Latest added quizzes</h2>
                                        <img src={accordionIcon}/>
                                    </header>

                                    {
                                        showAddedQuizzes && (
                                            <main className='created-quizzes-collection'>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Quiz title</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Quiz title</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Quiz title</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Quiz title</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                            </main>
                                        )
                                    }
                                    
                                </div>

                                <div className='created-quizzes'>
                                    <header onClick={toggleShowAddedUsers}>
                                        <h2>Latest added users</h2>
                                        <img src={accordionIcon}/>
                                    </header>

                                    {
                                        showAddedUsers && (
                                            <main className='created-quizzes-collection'>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Username</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Username</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Username</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                                <div className='created-quiz-item'>
                                                    <Link to=''>Date created - Username</Link>
                                                    <div className='action-links'>
                                                        <Link to=''>Delete</Link>
                                                    </div>
                                                </div>
                                            </main>
                                        )
                                    }
                                    
                                </div>

                                <div className='created-quizzes'>
                                    <header onClick={toggleShowCategories}>
                                        <h2>Categories</h2>
                                        <img src={accordionIcon}/>
                                    </header>

                                    {
                                        showCategories && (
                                            <main className='created-quizzes-collection'>
                                                {
                                                    !!categories.length && categories.map((cat)=>(
                                                        <div key={cat.id} className='created-quiz-item'>
                                                            <p>{cat.name}</p>
                                                            <p 
                                                                className='link'
                                                                onClick={()=>{handleDeleteCategorie(cat.id)}}
                                                            >
                                                                Delete
                                                            </p>
                                                        </div>
                                                    ))
                                                }

                                                <h3>Add new: </h3>
                                                <form 
                                                    onSubmit={addNewCategorie}
                                                    noValidate
                                                >
                                                    <input 
                                                        type='text'
                                                        value={newCategorieInput}
                                                        onChange={(e)=>{
                                                            setNewCategorieInput(e.target.value)
                                                        }}
                                                    />
                                                    <button type='submit' className='btn btn-info'>Add</button>
                                                </form>
                                            </main>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        )
                    }
                    </>

                )
            }

        </div>
    )
}

export default ProfilePage