import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import defaultAvatar from '../assets/icons/defaultavatar.svg'
import accordionIcon from '../assets/icons/accordion-icon.svg'
import SearchForm from '../components/SearchForm'
import Confirm from '../components/Confirm'

interface userData {
    uid: string,
    username: string,
    photoURL: string,
    role: string
}

const ProfilePage = () => {

    const { currentUser, getUser, getCategories, createCategorie, deleteCategorie, getQuizzesByUser, getAllUsers, getAllQuizzes, removeQuiz } = useAuthContext()
    const { uid } = useParams()

    const [userData, setUserData] = useState<userData>()
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])
    const [showCreated, setShowCreated] = useState(false)
    const [showPlayed, setShowPlayed] = useState(false)
    const [showAddedQuizzes, setShowAddedQuizzes] = useState(false)
    const [showAddedUsers, setShowAddedUsers] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
    const [newCategorieInput, setNewCategorieInput] = useState('')
    const [quizzesCreatedByUser, setQuizzesCreatedByUser] = useState<{id: string, name: string, createdAt: string}[]>([])
    const [allUsers, setAllUsers] = useState<{id: string, username: string, createdAt: string}[]>([])
    const [allQuizzes, setAllQuizzes] = useState<{id: string, name: string, createdAt: string}[]>([])

    const [openConfirm, setOpenConfirm] = useState(false)

    const [quizToDelete, setQuizToDelete] = useState<{id: string, name: string}>()

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

    const applyQuizzesCreatedByUser = async () => {
        setQuizzesCreatedByUser([...await getQuizzesByUser(userData?.uid)])
    }

    const applyAllUsers = async () => {
        setAllUsers([...await getAllUsers()])
    }

    const applyAllQuizzes = async () => {
        setAllQuizzes([...await getAllQuizzes()])
    }

    const handleDeleteQuiz = async () => {

        try {
            await removeQuiz(quizToDelete?.id)
            applyQuizzesCreatedByUser()
            if (userData?.role === "admin") {
                applyAllQuizzes()
            }
            closeConfirmModal()
        } catch (error) {
            console.log(error)
        }

    }

    const openConfirmModal = () => {
        setOpenConfirm(true)
    }

    const closeConfirmModal = () => {
        setOpenConfirm(false)
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

        if (userData) {
            applyQuizzesCreatedByUser()
        }

        if (userData?.role === "admin") {
            applyCategories()
            applyAllUsers()
            applyAllQuizzes()
        }
        
    }, [userData])

    useEffect(()=>{
        console.log('here are users: ', allUsers)
    }, [allUsers])

    useEffect(()=>{
        console.log('here are quizzes: ', allQuizzes)
    }, [allQuizzes])

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
                                    {
                                        !!quizzesCreatedByUser.length && quizzesCreatedByUser.map(quiz => (
                                            <div key={quiz.id} className='created-quiz-item'>
                                                <Link to={`/quiz/${quiz.id}`}>{quiz.createdAt} - {quiz.name}</Link>

                                                {
                                                    userData.uid === uid && (
                                                        <div className='action-links'>
                                                            <Link to=''>Update</Link>
                                                            <p 
                                                                onClick={()=>{
                                                                    setQuizToDelete({
                                                                        id: quiz.id,
                                                                        name: quiz.name
                                                                    })
                                                                    openConfirmModal()
                                                                }} 
                                                                className='link'
                                                            >
                                                                Delete
                                                            </p>
                                                        </div>
                                                    )
                                                }
                                                
                                            </div>
                                        ))
                                    }
                                    
                                    {/* Only show if this is signed in user */}
                                    {
                                        userData.uid === uid && <Link to='/createquiz' className='new-quiz-link'>+ New quiz</Link>
                                    }
                                    
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
                                                {
                                                    !!allQuizzes.length && allQuizzes.map(quiz => (
                                                        <div key={quiz.id} className='created-quiz-item'>
                                                            <Link to={`/quiz/${quiz.id}`}>{quiz.createdAt} - {quiz.name}</Link>
                                                            <div className='action-links'>
                                                            <p 
                                                                onClick={()=>{
                                                                    setQuizToDelete({
                                                                        id: quiz.id,
                                                                        name: quiz.name
                                                                    })
                                                                    openConfirmModal()
                                                                }} 
                                                                className='link'
                                                            >
                                                                Delete
                                                            </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
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
                                                {
                                                    !!allUsers.length && allUsers.map(user => (
                                                        <div key={user.id} className='created-quiz-item'>
                                                            <Link to={`/profile/${user.id}`}>{user.createdAt} - {user.username}</Link>
                                                            <div className='action-links'>
                                                                <Link to=''>Delete</Link>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
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

            {
                openConfirm &&
                <Confirm 
                    onConfirm={handleDeleteQuiz}
                    onCancel={closeConfirmModal}
                    actionText={`You are about to delete ${quizToDelete?.name}`}
                    requiresAuth={false}
                />
            }

        </div>
    )
}

export default ProfilePage