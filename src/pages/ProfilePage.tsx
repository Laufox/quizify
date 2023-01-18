import { useState, useEffect } from 'react'
import { Link, useParams } from "react-router-dom"
import { useAuthContext } from "../contexts/AuthContext"

import defaultAvatar from '../assets/icons/defaultavatar.svg'
import updateIcon from '../assets/icons/update-icon.svg'
import deleteIcon from '../assets/icons/delete-icon.svg'
import SearchForm from '../components/SearchForm'
import Confirm from '../components/Confirm'

import { UserData } from '../interfaces/UserData'
import { Categories } from '../interfaces/Categories'
import { Quiz } from '../interfaces/Quiz'
import { User } from '../interfaces/User'

import LoadingSpinnerGeneric from '../components/LoadingSpinnerGeneric'
import CollectionContainer from '../components/CollectionContainer'
import Alert from '../components/Alert'
import Pagination from '../components/Pagination'
import PageTransition from '../components/PageTransition'

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
    const [firebaseError, setFirebaseError] = useState('')
    const [openConfirm, setOpenConfirm] = useState(false)
    const [currentPageCreated, setCurrentPageCreated] = useState(1)
    const [currentPagePlayed, setCurrentPagePlayed] = useState(1)
    const [currentPageAllUsers, setCurrentPageAllUsers] = useState(1)
    const [currentPageAllQuizzes, setCurrentPageAllQuizzes] = useState(1)
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

        const response = await createCategoryDocument(newCategorieInput)

        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
        }

        applyCategories()
        setNewCategorieInput('')

    }
    
    const handleDeleteCategorie = async (id: string) => {
        
        const response = await deleteCategoryDocument(id)

        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
        }

        applyCategories()
        
    }

    const applyUserData = async () => {

        const response = await getUserDocument(uid)

        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return
        }

        setUserData({
            ...response.user,
            playedQuizzes: response.user?.playedQuizzes.reverse()
        })

    }

    const applyCategories = async () => {
        
        const response = await getAllCategoryDocuments()

        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return
        }

        setCategories([...response.categories])

    }

    const applyQuizzesCreatedByUser = async () => {
        
        if (!uid) {
            return
        }

        const response = uid === currentUser?.uid 
            ? await getAllQuizDocumentsByUser(userData?.uid)
            : await getAllPublicQuizDocumentsByUser(userData?.uid)

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return
            
        }

        setQuizzesCreatedByUser([...response.quizzes])

    }

    const applyAllUsers = async () => {

        const response = await getAllUserDocuments()

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return

        }

        setAllUsers([...await response.users])

    }

    const applyAllQuizzes = async () => {

        const response = await getAllQuizDocuments()

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return

        }

        setAllQuizzes([...response.quizzes])

    }

    const handleDeleteQuiz = async () => {

        const response = await deleteQuizDocument(objectToDelete?.id)

        if (!response.success) {

            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return

        }

        applyQuizzesCreatedByUser()
        if (userData?.role === "admin") {
            applyAllQuizzes()
        }
        closeConfirmModal()

    }

    const handleDeleteUser = async (user: User) => {

        const response = await deleteUserAccountAdmin(user.id, user.photoURL ? true : false)

        if (!response.success) {
            setFirebaseError(response?.error?.message ?? 'An unknown error has occured.')
            return
        }

        applyAllUsers()

    }

    const openConfirmModal = () => {
        setOpenConfirm(true)
    }

    const closeConfirmModal = () => {
        setOpenConfirm(false)
    }
    
    useEffect(()=>{

        if (uid) {
            applyUserData()
        }

    }, [uid])

    useEffect(()=>{

        if (userData) {
            applyQuizzesCreatedByUser()
        }

        if ((currentUser?.uid === userData?.uid) && userData?.role === "admin") {
            applyCategories()
            applyAllUsers()
            applyAllQuizzes()
        }
        
    }, [userData])

    return (
        <PageTransition>
            <>
            {
                loading.getUser ? (

                    <LoadingSpinnerGeneric size='large' />

                ) : (

                    userData && (

                        <>
                        <div className="profile-info">
                            <div className="profile-avatar-container">
                                <img src={userData.photoURL ? userData.photoURL : defaultAvatar} alt='avatar-image-preview' className="avatar-image-preview" />
                            </div>
                            <h1>{ userData.username }</h1>
                            {
                                userData.uid === currentUser?.uid &&
                                <Link to={`/updateprofile/${userData.uid}`}>Update profile</Link>
                            }
                        </div>
    
                        <CollectionContainer
                            onToggle={toggleShowCreated}
                            title={`Quizzes created by ${userData.username}`}
                            loadingState={loading.getQuizzes}
                            showState={showCreated}
                        >
                            <>
                            {
                                quizzesCreatedByUser.length > 10 && (
                                    <Pagination 
                                        items={quizzesCreatedByUser} 
                                        currentPage={currentPageCreated} 
                                        onPageSwitch={(page: number) => {setCurrentPageCreated(page)}}
                                    />
                                )
                            }

                            {
                                !!quizzesCreatedByUser.length && quizzesCreatedByUser.slice(currentPageCreated*10-10, currentPageCreated*10).map(quiz => (
                                    <div key={quiz.id} className='collection-row'>
                                        <Link to={`/quiz/${quiz.id}`} className='collection-row-main'>{quiz.createdAt} - {quiz.name}</Link>

                                        {
                                            userData.uid === uid && (
                                                <div className='collection-row-actions'>
                                                    <Link to={`/updatequiz/${quiz.id}`} className=''>
                                                        <img src={updateIcon} />
                                                    </Link>
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
                                                        <img src={deleteIcon} />
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
                        </CollectionContainer>

                        <CollectionContainer
                            onToggle={toggleShowPlayed}
                            title={`Quizzes played by ${userData.username}`}
                            loadingState={loading.getQuizzes}
                            showState={showPlayed}
                        >
                            <>
                            {
                                userData.playedQuizzes.length > 10 && (
                                    <Pagination 
                                        items={userData.playedQuizzes} 
                                        currentPage={currentPagePlayed} 
                                        onPageSwitch={(page: number) => {setCurrentPagePlayed(page)}}
                                    />
                                )
                            }

                            {
                                !!userData.playedQuizzes.length && userData.playedQuizzes.slice(currentPagePlayed*10-10, currentPagePlayed*10).map((quiz, i) => (
                                    <div key={i} className='collection-row'>
                                        <Link to={`/quiz/${quiz.id}`} className='collection-row-main'>{quiz.playedAt.slice(2)} - {quiz.name}</Link>
                                        <span className='collection-row-extra'>{quiz.scorePercentage} %</span>
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
                        </CollectionContainer>
    
                        {
                            (currentUser?.uid === userData?.uid) && userData.role === "admin" && (
                                <div className='admin-panel'>
    
                                    <hr />
    
                                    <h2>Admin control</h2>
    
                                    <SearchForm onSearch={()=>{}} />

                                    <CollectionContainer 
                                        onToggle={toggleShowAddedQuizzes}
                                        title='All created quizzes'
                                        loadingState={loading.getQuizzes}
                                        showState={showAddedQuizzes}
                                    >
                                        <>
                                        {
                                            allQuizzes.length > 10 && (
                                                <Pagination 
                                                    items={allQuizzes} 
                                                    currentPage={currentPageAllQuizzes} 
                                                    onPageSwitch={(page: number) => {setCurrentPageAllQuizzes(page)}}
                                                />
                                            )
                                        }

                                        {
                                            !!allQuizzes.length && allQuizzes.slice(currentPageAllQuizzes*10-10, currentPageAllQuizzes*10).map(quiz => (
                                                <div key={quiz.id} className='collection-row'>
                                                    <Link to={`/quiz/${quiz.id}`} className='collection-row-main'>{quiz.createdAt} - {quiz.name}</Link>
                                                    <div className='collection-row-actions'>
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
                                                        <img src={deleteIcon} />
                                                    </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        </>
                                        
                                    </CollectionContainer>

                                    <CollectionContainer
                                        onToggle={toggleShowAddedUsers}
                                        title='All created users'
                                        loadingState={loading.getUsers}
                                        showState={showAddedUsers}
                                    >
                                        <>
                                        {
                                            allUsers.length > 10 && (
                                                <Pagination 
                                                    items={allUsers} 
                                                    currentPage={currentPageAllUsers} 
                                                    onPageSwitch={(page: number) => {setCurrentPageAllUsers(page)}}
                                                />
                                            )
                                        }

                                        {
                                            !!allUsers.length && allUsers.slice(currentPageAllUsers*10-10, currentPageAllUsers*10).map(user => (
                                                <div key={user.id} className='collection-row'>
                                                    <Link to={`/profile/${user.id}`} className='collection-row-main'>{user.createdAt} - {user.name}</Link>
                                                    <div className='collection-row-actions'>
                                                        <p 
                                                            className='link' 
                                                            onClick={()=>{handleDeleteUser(user)}}
                                                        >
                                                            <img src={deleteIcon} />
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        </>
                                    </CollectionContainer>

                                    <CollectionContainer
                                        onToggle={toggleShowCategories}
                                        title='Categories'
                                        loadingState={loading.getCategories}
                                        showState={showCategories}
                                    >
                                        <>
                                        {
                                            !!categories.length && categories.map((cat)=>(
                                                <div key={cat.id} className='collection-row'>
                                                    <p className='collection-row-main'>{cat.name}</p>
                                                    <div className='collection-row-actions'>
                                                        <p 
                                                            className='link'
                                                            onClick={()=>{handleDeleteCategorie(cat.id)}}
                                                        >
                                                            <img src={deleteIcon} />
                                                        </p>
                                                    </div>
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
                                            <button type='submit' className='btn btn-info btn-action'>Add</button>
                                        </form>
                                        </>
                                    </CollectionContainer>
                                    
                                </div>
                            )
                        }
                        </>
    
                    )

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

            {
                firebaseError && (
                    <Alert
                        onCancel={()=>{setFirebaseError('')}}
                        message={firebaseError}
                    />
                )
            }
            </>
        </PageTransition>
    )
}

export default ProfilePage