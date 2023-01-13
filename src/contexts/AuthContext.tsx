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

// Initiate context
const AuthContext = createContext<any>(undefined)

const useAuthContext = () => {
    return useContext(AuthContext)
}

// The component itself, with functions and variables to be used by its children
const AuthContextProvider = ({ children }: any) => {

    // State for user currently signed in through firebase
    const [currentUser, setCurrentUser] = useState<any>()
    const [userLoading, setUserLoading] = useState(true)


    /********************************************************
     **                                                    **
     *   Functions related to USER AUTHENTICATION actions   *
     **                                                    **
     ********************************************************/


    // Function for creating a new user 
    const createUserAccount = async (email: string, password: string, username: string, photo: File) => {

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

    }

    // Function to sign in user with firebase
    const signinUserAccount = async (email: string, password: string) => {

        await signInWithEmailAndPassword(auth, email, password)

    }

    // FUnction to sign out user with firebase
    const signoutUserAccount = () => {

        return signOut(auth)

    }

    // Function to send email to reset user password with firebase
    const resetUserAccountPassword = async (email: string) => {

        await sendPasswordResetEmail(auth, email)

    }
    
    // Function to update a user account
    const updateUserAccount = async (email: string, password: string, username: string, photo: File) => {
        
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

        // If user had a profile photo but removed it, delete it from storage and update profile data
        if (!photo && auth.currentUser.photoURL) {
            await deleteObject(ref(storage, `avatars/${auth.currentUser.uid}`))
            await updateProfile(auth.currentUser, {
                photoURL: ""
            })
        }
        
        if (email) {
            await updateEmail(auth.currentUser, email)
        }
        
        if (password) {
            await updatePassword(auth.currentUser, password)
        }
        
        // Update user document in firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            email: email ?? auth.currentUser.email,
            username,
            photoURL: photoURL ?? auth.currentUser.photoURL
        }, {
            merge: true
        })
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
            return
        }

        // Delete possible avatar from storage
        if (auth.currentUser.photoURL) {

            await deleteObject(ref(storage, `avatars/${auth.currentUser.uid}`))

        }

        // Delete user doc from firestore
        await deleteDoc(doc(db, "users", auth.currentUser.uid))

        // Delete user from auth
        await deleteUser(auth.currentUser)

    }

    // Function fro admins to delete a user
    const deleteUserAccountAdmin = async (uid: string, hasPhoto: boolean) => {

        if (!auth.currentUser) {
            return
        }

        // Delete possible avatar from storage
        if (hasPhoto) {
            await deleteObject(ref(storage, `avatars/${uid}`))
        }

        // Delete user doc from firestore
        await deleteDoc(doc(db, "users", uid))

        return await adminDeleteUser(uid)

    }


    /********************************************************
     **                                                    **
     *      Functions related to QUIZ database actions      *
     **                                                    **
     ********************************************************/


    // Create new quiz document to firestore
    const createQuizDocument = async (data: any) => {

        if (!auth.currentUser) {
            return
        }

        await addDoc(collection(db, "quizzes"), {
            authorId: auth.currentUser.uid,
            authorName: auth.currentUser.displayName,
            createdAt: new Date(),
            ...data
        })

    }

    // Delete quiz document from firestore
    const deleteQuizDocument = async (id: string) => {

        await deleteDoc(doc(db, "quizzes", id))

    }

    // Get one quiz document from firestore
    const getQuizDocument = async (id: string) => {

        const quizSnap = await getDoc(doc(db, 'quizzes', id))

        if (quizSnap.exists()) {
            return {
                ...quizSnap.data(),
                createdAt: new Date(quizSnap.data().createdAt.toMillis()).toISOString().slice(0, 10)
            }
        }

    }

    const getMultipleQuizDocuments = async (collectionReference: Query<DocumentData>) => {

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
                createdAt: new Date(quiz.data().createdAt.toMillis()).toISOString().slice(0, 10)
            })
        })

        return arrayOfQuizzes

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
            return
        }

        await setDoc(doc(db, 'quizzes', id), {
            ...data
        }, {
            merge: true
        })
    }


    /********************************************************
     **                                                    **
     *    Functions related to CATEGORY database actions    *
     **                                                    **
     ********************************************************/


    // Get all category documents from database
    const getAllCategoryDocuments = async () => {

        const arrayOfCategories: Categories[] = []

        const allCategoriesSnap = await getDocs(query(collection(db, "categories"), orderBy("name")))

        allCategoriesSnap.forEach((cat) => {
            arrayOfCategories.push({
                id: cat.id,
                name: cat.data().name
            })
        })

        return arrayOfCategories

    }

    // Create new category document to firestore
    const createCategoryDocument = async (name: string) => {

        await addDoc(collection(db, "categories"), {
            name
        })

    }

    // Delete category document from firestore
    const deleteCategoryDocument = async (id: string) => {
        
        await deleteDoc(doc(db, "categories", id))

    }


    /********************************************************
     **                                                    **
     *     Functions related to USER database actions       *
     **                                                    **
     ********************************************************/


    // Get a user document from firestore
    const getUserDocument = async (uid: string) => {

        const docSnap = await getDoc(doc(db, "users", uid))

        if (docSnap.exists()) {
            return docSnap.data()
        }

    }

    // Get all user documents from firestore
    const getAllUserDocuments = async () => {

        const arrayOfUsers: User[] = []

        const allUsersSnap = await getDocs(collection(db, "users"))

        allUsersSnap.forEach(user => {
            arrayOfUsers.push({
                id: user.id,
                name: user.data().username,
                photoURL: user.data().photoURL,
                createdAt: new Date(user.data().createdAt.toMillis()).toISOString().slice(0, 10)
            })
        })

        return arrayOfUsers
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
            setUserLoading(false)
        })

        return unsubscribe

    }, [])

    return (
        <AuthContext.Provider value={contextValues}>
            {
                userLoading ? (
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