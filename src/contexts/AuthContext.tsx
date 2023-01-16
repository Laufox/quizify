/**
 * 
 * Context to handle authorization of site users
 * 
 **/ 

// React related imports
import { useContext, createContext, useEffect, useState } from "react"

import { adminDeleteUser } from '../api-services/userAPI'

// FIrebase imports
import { 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updateProfile, 
    updateEmail, 
    updatePassword, 
    reauthenticateWithCredential, 
    EmailAuthProvider, 
    deleteUser 
} from 'firebase/auth'

import { 
    auth, 
    db, 
    storage 
} from '../firebase'

import { 
    doc, 
    setDoc, 
    getDoc, 
    deleteDoc, 
    addDoc, 
    collection, 
    getDocs, 
    where, 
    query, 
    QuerySnapshot,
    DocumentData,
    Query,
    arrayUnion,
    orderBy,
    startAt,
    endAt
} from 'firebase/firestore'

import { 
    getDownloadURL, 
    ref, 
    uploadBytes, 
    deleteObject
} from "firebase/storage"

import { User } from "../interfaces/User"
import { Categories } from "../interfaces/Categories"
import { Quiz } from "../interfaces/Quiz"
import { QuizResults } from "../interfaces/QuizResults"
import LoadingSpinner from "../components/LoadingSpinner"

interface Props {
    children: JSX.Element
}

// Initiate context
const AuthContext = createContext<any>(undefined)

const useAuthContext = () => {
    return useContext(AuthContext)
}

// The component itself, with functions and variables to be used by its children
const AuthContextProvider = ({ children }: Props) => {

    // State for user currently signed in through firebase
    const [currentUser, setCurrentUser] = useState<any>()
    const [userLoading, setUserLoading] = useState(true)
    const [loading, setLoading] = useState({
        user: true,
        createUser: false,
        signinUser: false,
        resetPassword: false,
        updateUser: false,
        deleteUser: false,
        createQuiz: false,
        updateQuiz: false,
        deleteQuiz: false,
        getQuizzes: false,
        getCategories: false,
        getUsers: false,
        getUser: false,
        getQuiz: false,
    })

    /********************************************************
     **                                                    **
     *   Functions related to USER AUTHENTICATION actions   *
     **                                                    **
     ********************************************************/


    // Function for creating a new user 
    const createUserAccount = async (email: string, password: string, username: string, photo: File) => {

        setLoading({
            ...loading,
            createUser: true
        })
        
        try {

            // Create user through firebase with given credentials
            await createUserWithEmailAndPassword(auth, email, password)

            // If creation did not succeed, return early
            if (!auth.currentUser) {
                return
            }

            let photoURL

            // If a photo was given, upload photo to storage and then asign photo and username to currentuser profile
            if (photo) {
                const uploadPhoto = await uploadBytes(ref(storage, `avatars/${auth.currentUser.uid}`), photo)
                photoURL = await getDownloadURL(uploadPhoto.ref)

                await updateProfile(auth.currentUser, {
                    displayName: username,
                    photoURL
                })
            } else {
                await updateProfile(auth.currentUser, {
                    displayName: username
                })
            }

            // Create new firestore document for the new user
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                email,
                username,
                role: 'user',
                createdAt: new Date(),
                photoURL: photoURL ?? "",
                playedQuizzes: []
            })

            return {
                success: true
            }

        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                createUser: false
            })

        }

    }

    // Function to sign in user with firebase
    const signinUserAccount = async (email: string, password: string) => {

        setLoading({
            ...loading,
            signinUser: true
        })

        try {

            await signInWithEmailAndPassword(auth, email, password)

            return {
                success: true
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                signinUser: false
            })

        }

    }

    // FUnction to sign out user with firebase
    const signoutUserAccount = () => {

        return signOut(auth)

    }

    // Function to send email to reset user password with firebase
    const resetUserAccountPassword = async (email: string) => {

        setLoading({
            ...loading,
            resetPassword: true
        })

        try {
            
            await sendPasswordResetEmail(auth, email)

            return {
                success: true
            }

        } catch (error) {
            
            return {
                success: false,
                error
            }

        } finally {

            setLoading({
                ...loading,
                resetPassword: false
            })

        }
        
    }
    
    // Function to update a user account
    const updateUserAccount = async (email: string, newPassword: string, currentPassword: string, username: string, photo: File) => {

        if (!auth.currentUser) {
            return {
                success: false
            }
        }

        setLoading({
            ...loading,
            updateUser: true
        })
        
        try {

            let photoURL
        
            // If a photo was given, upload photo to storage and then asign photo and username to currentuser profile
            if (photo) {
                const uploadPhoto = await uploadBytes(ref(storage, `avatars/${auth.currentUser.uid}`), photo)
                photoURL = await getDownloadURL(uploadPhoto.ref)
                
                await updateProfile(auth.currentUser, {
                    displayName: username,
                    photoURL
                })
            } else {
                await updateProfile(auth.currentUser, {
                    displayName: username
                })
            }

            // If user had a profile photo but removed it, delete it from storage and update profile data
            if (!photo && auth.currentUser.photoURL) {
                await deleteObject(ref(storage, `avatars/${auth.currentUser.uid}`))
                await updateProfile(auth.currentUser, {
                    photoURL: ""
                })
            }
            
            if (email) {
                await verifyUserAccount(currentPassword)
                await updateEmail(auth.currentUser, email)
            }
            
            if (newPassword) {
                await verifyUserAccount(currentPassword)
                await updatePassword(auth.currentUser, newPassword)
            }
            
            // Update user document in firestore
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                email: email ?? auth.currentUser.email,
                username,
                photoURL: photoURL ?? auth.currentUser.photoURL
            }, {
                merge: true
            })

            return {
                success: true
            }
            
        } catch (error) {

            return {
                success: false, 
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                updateUser: false
            })

        }
        
    }

    // Function for when user has to verify their account by reentering their password
    const verifyUserAccount = async (password: string) => {

        if (!auth.currentUser || !auth.currentUser.email) {
            return
        }

        await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser?.email, password))

    }

    // Function to delete a user
    const deleteUserAccount = async () => {
        
        if (!auth.currentUser) {
            return {
                success: false
            }
        }

        setLoading({
            ...loading,
            deleteUser: true
        })

        try {

            // Delete possible avatar from storage
            if (auth.currentUser.photoURL) {

                await deleteObject(ref(storage, `avatars/${auth.currentUser.uid}`))

            }

            // Delete user doc from firestore
            await deleteDoc(doc(db, "users", auth.currentUser.uid))

            // Delete user from auth
            await deleteUser(auth.currentUser)

            return {
                success: true
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                deleteUser: false
            })

        }
        
    }

    // Function fro admins to delete a user
    const deleteUserAccountAdmin = async (uid: string, hasPhoto: boolean) => {

        if (!auth.currentUser) {
            return {
                success: false
            }
        }

        setLoading({
            ...loading,
            getUser: true
        })

        // Delete possible avatar from storage
        if (hasPhoto) {
            await deleteObject(ref(storage, `avatars/${uid}`))
        }

        // Delete user doc from firestore
        await deleteDoc(doc(db, "users", uid))

        const response = await adminDeleteUser(uid)
        
        setLoading({
            ...loading,
            getUser: true
        })
        
        return response.data

    }


    /********************************************************
     **                                                    **
     *      Functions related to QUIZ database actions      *
     **                                                    **
     ********************************************************/


    // Create new quiz document to firestore
    const createQuizDocument = async (data: any) => {

        if (!auth.currentUser) {
            return {
                success: false
            }
        }

        setLoading({
            ...loading,
            createQuiz: true
        })

        try {

            const quizDoc = await addDoc(collection(db, "quizzes"), {
                authorId: auth.currentUser.uid,
                authorName: auth.currentUser.displayName,
                createdAt: new Date(),
                ...data
            })

            return {
                success: true,
                quizId: quizDoc.id
            }
            
        } catch (error) {
            
            return {
                success: false,
                error
            }

        } finally {

            setLoading({
                ...loading,
                createQuiz: false
            })

        }
        
    }

    // Delete quiz document from firestore
    const deleteQuizDocument = async (id: string) => {

        if (!auth.currentUser) {
            return {
                success: false
            }
        }

        setLoading({
            ...loading,
            deleteQuiz: true
        })

        try {

            await deleteDoc(doc(db, "quizzes", id))

            return {
                success: true
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                deleteQuiz: false
            })

        }

    }

    // Get one quiz document from firestore
    const getQuizDocument = async (id: string) => {

        setLoading({
            ...loading,
            getQuiz: true
        })

        try {

            const quizSnap = await getDoc(doc(db, 'quizzes', id))

            if (!quizSnap.exists()) {
                return {
                    success: false,
                    error: {
                        code: 'Doc not found',
                        message: 'Quiz document could not be retrieved'
                    }
                }
            }

            return {
                success: true,
                quiz: {
                    ...quizSnap.data(),
                    createdAt: new Date(quizSnap.data().createdAt.toMillis()).toISOString().slice(2, 10)
                }
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                getQuiz: false
            })

        }

    }

    const getMultipleQuizDocuments = async (collectionReference: Query<DocumentData>) => {

        setLoading({
            ...loading,
            getQuizzes: true
        })

        try {

            const arrayOfQuizzes: Quiz[] = []

            const allQuizzesSnap: QuerySnapshot<DocumentData> = await getDocs(collectionReference)

            allQuizzesSnap.forEach(quiz => {
                arrayOfQuizzes.push({
                    id: quiz.id,
                    authorId: quiz.data().authorId,
                    authorName: quiz.data().authorName,
                    name: quiz.data().name,
                    category: quiz.data().category,
                    description: quiz.data().description,
                    tags: quiz.data().tags,
                    questions: quiz.data().questions,
                    visibility: quiz.data().visibility,
                    createdAt: new Date(quiz.data().createdAt.toMillis()).toISOString().slice(2, 10)
                })
            })

            return {
                success: true,
                quizzes: arrayOfQuizzes
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                getQuizzes: false
            })

        }

    }

    // Gett all public quiz documents from a specific user
    const getAllPublicQuizDocumentsByUser = async (uid: string) => {

        return await getMultipleQuizDocuments(query(collection(db, "quizzes"), where("authorId", "==", uid), where("visibility", "==", "public")))
        
    }

    // Get all quiz document from a specific user 
    const getAllQuizDocumentsByUser = async (uid: string) => {

        return await getMultipleQuizDocuments(query(collection(db, "quizzes"), where("authorId", "==", uid)))
        
    }

    // Get all public quiz documents from firestore
    const getAllPublicQuizDocuments = async () => {

        return await getMultipleQuizDocuments(query(collection(db, "quizzes"), where("visibility", "==", "public")))

    }

    // Get all quiz documents from firestore
    const getAllQuizDocuments = async () => {

        return await getMultipleQuizDocuments(collection(db, "quizzes"))

    }
    
    // Update a quiz document in firestore
    const updateQuizDocument = async (data: any, id: string) => {

        if (!auth.currentUser) {
            return {
                success: false
            }
        }

        setLoading({
            ...loading,
            updateQuiz: true
        })

        try {

            await setDoc(doc(db, 'quizzes', id), {
                ...data
            }, {
                merge: true
            })

            return {
                success: true
            }
            
        } catch (error) {

            return {

                success: false,
                error

            }
            
        } finally {

            setLoading({
                ...loading,
                createQuiz: false
            })

        }
        
    }


    /********************************************************
     **                                                    **
     *    Functions related to CATEGORY database actions    *
     **                                                    **
     ********************************************************/


    // Get all category documents from database
    const getAllCategoryDocuments = async () => {

        setLoading({
            ...loading,
            getCategories: true
        })

        try {

            const arrayOfCategories: Categories[] = []

            const allCategoriesSnap = await getDocs(query(collection(db, "categories"), orderBy("name")))

            allCategoriesSnap.forEach((cat) => {
                arrayOfCategories.push({
                    id: cat.id,
                    name: cat.data().name
                })
            })

            return {
                success: true,
                categories: arrayOfCategories
            }
            
        } catch (error) {
            
            return {
                success: false,
                error
            }

        } finally {

            setLoading({
                ...loading,
                getCategories: false
            })

        }

    }

    // Create new category document to firestore
    const createCategoryDocument = async (name: string) => {

        setLoading({
            ...loading,
            getCategories: true
        })

        try {

            await addDoc(collection(db, "categories"), {
                name
            })

            return {
                success: true
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                getCategories: false
            })

        }
        
    }

    // Delete category document from firestore
    const deleteCategoryDocument = async (id: string) => {
        
        setLoading({
            ...loading,
            getCategories: true
        })

        try {

            await deleteDoc(doc(db, "categories", id))

            return {
                success: true
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                getCategories: false
            })

        }
        
    }


    /********************************************************
     **                                                    **
     *     Functions related to USER database actions       *
     **                                                    **
     ********************************************************/


    // Get a user document from firestore
    const getUserDocument = async (uid: string) => {

        setLoading({
            ...loading,
            getUser: true
        })

        try {

            const docSnap = await getDoc(doc(db, "users", uid))

            if (!docSnap.exists()) {
                return {
                    success: false,
                    error: {
                        code: 'Doc not found',
                        message: 'User document could not be retrieved'
                    }
                }
            }

            return {
                success: true,
                user: docSnap.data()
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                getUser: false
            })

        }
        
    }

    // Get all user documents from firestore
    const getAllUserDocuments = async () => {

        setLoading({
            ...loading,
            getUsers: true
        })

        try {

            const arrayOfUsers: User[] = []

            const allUsersSnap = await getDocs(collection(db, "users"))

            allUsersSnap.forEach(user => {
                arrayOfUsers.push({
                    id: user.id,
                    name: user.data().username,
                    photoURL: user.data().photoURL,
                    createdAt: new Date(user.data().createdAt.toMillis()).toISOString().slice(2, 10)
                })
            })

            return {
                success: true,
                users: arrayOfUsers
            }
            
        } catch (error) {

            return {
                success: false,
                error
            }
            
        } finally {

            setLoading({
                ...loading,
                getUsers: false
            })

        }

    }

    const addQuizResultToUser = async (quizResults: QuizResults) => {

        if (!currentUser.uid) {
            return
        }

        await setDoc(doc(db, "users", currentUser.uid), {
            
            playedQuizzes: arrayUnion({
                ...quizResults,
                playedAt: new Date().toISOString().slice(0, 10)
            })

        }, {
            merge: true
        })

    }

    // Object with variables and functions that children components can use
    const contextValues= {
        currentUser,
        loading,
        createUserAccount,
        signinUserAccount,
        signoutUserAccount,
        resetUserAccountPassword,
        updateUserAccount,
        verifyUserAccount,
        deleteUserAccount,
        createQuizDocument,
        getQuizDocument,
        getAllQuizDocumentsByUser,
        getAllQuizDocuments,
        getAllPublicQuizDocuments,
        getAllPublicQuizDocumentsByUser,
        updateQuizDocument,
        deleteQuizDocument,
        getAllCategoryDocuments,
        createCategoryDocument,
        deleteCategoryDocument,
        getUserDocument,
        getAllUserDocuments,
        addQuizResultToUser,
        deleteUserAccountAdmin
    }

    // Useeffect to reflect auth changes and apply changes to currentuser variable
    useEffect(()=>{

        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
            setLoading({
                ...loading,
                user: false
            })
        })

        return unsubscribe

    }, [])

    return (
        <AuthContext.Provider value={contextValues}>
            {
                loading.user ? (
                    <LoadingSpinner />
                ) : (
                    children
                )
            }
        </AuthContext.Provider>
    )
}

export {
    AuthContextProvider as default,
    useAuthContext
}