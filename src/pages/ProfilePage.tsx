import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import defaultAvatar from '../assets/icons/defaultavatar.svg'
import accordionIcon from '../assets/icons/accordion-icon.svg'
import SearchForm from '../components/SearchForm'
import Confirm from '../components/Confirm'

import { UserData } from '../interfaces/UserData'
import { Categories } from '../interfaces/Categories'
import { Quiz } from '../interfaces/Quiz'
import { User } from '../interfaces/User'

import { adminDeleteUser } from '../api-services/userAPI'
import LoadingSpinnerGeneric from '../components/LoadingSpinnerGeneric'

const ProfilePage = () => {

    const { currentUser, getUserDocument, getAllCategoryDocuments,createCategoryDocument, deleteCategoryDocument, getAllQuizDocumentsByUser, getAllUserDocuments, getAllQuizDocuments, deleteQuizDocument, getAllPublicQuizDocumentsByUser, deleteUserAccountAdmin, loading } = useAuthContext()
    const { uid } = useParams()

    const [userData, setUserData] = useState<UserData>()
    const [categories, setCategories] = useState<Categories[]>([])
    const [showCreated, setShowCreated] = useState(false)
    const [showPlayed, setShowPlayed] = useState(false)
    const [showAddedQuizzes, setShowAddedQuizzes] = useState(false)
    const [showAddedUsers, setShowAddedUsers] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
    const [newCategorieInput, setNewCategorieInput] = useState('')
    const [quizzesCreatedByUser, setQuizzesCreatedByUser] = useState<Quiz[]>([])
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])

    const [openConfirm, setOpenConfirm] = useState(false)

    const [objectToDelete, setObjectToDelete] = useState<{id: string, name: string}>()

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
            await createCategoryDocument(newCategorieInput)
            applyCategories()
            setNewCategorieInput('')
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleDeleteCategorie = async (id: string) => {
        
        try {
            await deleteCategoryDocument(id)
            applyCategories()
        } catch (error) {
            console.log(error)
        }
        
    }

    const applyCategories = async () => {
        
        const response = await getAllCategoryDocuments()

        if (!response.success) {
            console.log('There was an error: ', response.error)
            return
        }

        setCategories([...response.categories])

    }

    const applyQuizzesCreatedByUser = async () => {
        
        if (!uid || !currentUser?.uid) {
            return
        }

        const respons = uid === currentUser.uid 
            ? await getAllQuizDocumentsByUser(userData?.uid)
            : await getAllPublicQuizDocumentsByUser(userData?.uid)

        if (!respons.success) {
            console.log('Error has occured: ', respons.error)
            return
        }

        setQuizzesCreatedByUser([...respons.quizzes])
        
        // setQuizzesCreatedByUser(
        //     uid === currentUser.uid 
        //     ? [...await getAllQuizDocumentsByUser(userData?.uid)].reverse()
        //     : [...await getAllPublicQuizDocumentsByUser(userData?.uid)].reverse()
        // )
    }

    const applyAllUsers = async () => {
        setAllUsers([...await getAllUserDocuments()].reverse())
    }

    const applyAllQuizzes = async () => {

        const response = await getAllQuizDocuments()

        if (!response.success) {

            console.log('Error has happended: ', response.error)
            return

        }

        setAllQuizzes([...response.quizzes])

        // setAllQuizzes([...await getAllQuizDocuments()].reverse())
    }

    const handleDeleteQuiz = async () => {

        try {
            await deleteQuizDocument(objectToDelete?.id)
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
                const tempUserData: UserData = await getUserDocument(uid)
                tempUserData.playedQuizzes = tempUserData.playedQuizzes.reverse()
                setUserData(tempUserData)
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
                                        loading.getQuizzes ? (

                                            <LoadingSpinnerGeneric size='medium' />

                                        ) : (

                                            <>
                                            {
                                                !!quizzesCreatedByUser.length && quizzesCreatedByUser.map(quiz => (
                                                    <div key={quiz.id} className='created-quiz-item'>
                                                        <Link to={`/quiz/${quiz.id}`}>{quiz.createdAt} - {quiz.name}</Link>

                                                        {
                                                            userData.uid === uid && (
                                                                <div className='action-links'>
                                                                    <Link to={`/updatequiz/${quiz.id}`}>Update</Link>
                                                                    <p 
                                                                        onClick={()=>{
                                                                            setObjectToDelete({
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

                                            {
                                                !quizzesCreatedByUser.length && (
                                                    <div>
                                                        <p>No quizzes created yet</p>
                                                    </div>
                                                )
                                            }
                                            
                                            {/* Only show if this is signed in user */}
                                            {
                                                userData.uid === uid && <Link to='/createquiz' className='new-quiz-link'>+ New quiz</Link>
                                            }
                                            </>

                                        )
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

                                    {
                                        loading.getQuizzes ? (

                                            <LoadingSpinnerGeneric size='medium' />

                                        ) : (

                                            <>
                                            {
                                                !!userData.playedQuizzes.length && userData.playedQuizzes.map((quiz, i) => (
                                                    <div key={i} className='played-quiz-item'>
                                                        <Link to={`/quiz/${quiz.id}`}>{quiz.playedAt} - {quiz.name}</Link>
                                                        <span>{quiz.scorePercentage} %</span>
                                                    </div>
                                                ))
                                                
                                            }

                                            {
                                                !userData.playedQuizzes.length && (
                                                    <div>
                                                        <p>No quizzes played yet</p>
                                                    </div>
                                                )
                                            }
                                            </>

                                        )
                                    }
                                    
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
                                                    loading.getQuizzes ? (

                                                        <LoadingSpinnerGeneric size='medium' />

                                                    ) : (

                                                        !!allQuizzes.length && allQuizzes.map(quiz => (
                                                            <div key={quiz.id} className='created-quiz-item'>
                                                                <Link to={`/quiz/${quiz.id}`}>{quiz.createdAt} - {quiz.name}</Link>
                                                                <div className='action-links'>
                                                                <p 
                                                                    onClick={()=>{
                                                                        setObjectToDelete({
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

                                                    )
                                                    
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
                                                            <Link to={`/profile/${user.id}`}>{user.createdAt} - {user.name}</Link>
                                                            <div className='action-links'>
                                                                <p className='link' onClick={async ()=>{
                                                                    try {
                                                                        console.log('test')
                                                                        await deleteUserAccountAdmin(user.id, user.photoURL ? true : false)
                                                                        console.log('after call')
                                                                        applyAllUsers()
                                                                        console.log('after apply')

                                                                    } catch (error: any) {
                                                                        console.log('error')
                                                                        console.log('error code: ', error.code)
                                                                        console.log('error msg: ', error.message)
                                                                    }
                                                                    }}>Delete</p>
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
                                                    loading.getCategories ? (

                                                        <LoadingSpinnerGeneric size='medium' />

                                                    ) : (
                                                        <>
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
                                                        </>
                                                    )
                                                }
                                                
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
                    actionText={`You are about to delete ${objectToDelete?.name}`}
                    requiresAuth={false}
                />
            }

        </div>
    )
}

export default ProfilePage