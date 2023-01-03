/**
 * 
 * Context to handle authorization of site users
 * 
 **/ 

// React related imports
import { useContext, createContext, useEffect, useState } from "react"

// FIrebase imports
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { doc, setDoc, getDoc, deleteDoc, addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage"

// Initiate context
const AuthContext = createContext<any>(undefined)

const useAuthContext = () => {
    return useContext(AuthContext)
}

// The component itself, with functions and variables to be used by its children
const AuthContextProvider = ({ children }: any) => {

    // State for user currently signed in through firebase
    const [currentUser, setCurrentUser] = useState<any>()

    // Function for creating a new user 
    const signup = async (email: string, password: string, username: string, photo: File) => {
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
            photoURL: photoURL ?? ""
        })


    }

    // Function to sign in user with firebase
    const signin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    // FUnction to sign out user with firebase
    const logout = () => {
        return signOut(auth)
    }

    // Function to send email to reset user password with firebase
    const passwordReset = async (email: string) => {
        await sendPasswordResetEmail(auth, email)
    }

    const getUser = async (uid: string) => {
        const docSnap = await getDoc(doc(db, "users", uid))

        if (docSnap.exists()) {
            return docSnap.data()
        }
    }

    const updateAccount = async (email: string, password: string, username: string, photo: File, removePhoto: boolean) => {

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

        if (removePhoto) {
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

        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            email: email ?? auth.currentUser.email,
            username,
            photoURL: photoURL ?? auth.currentUser.photoURL
        }, {
            merge: true
        })
    }

    const verifyUser = async (password: string) => {

        if (!auth.currentUser || !auth.currentUser.email) {
            return
        }

        await reauthenticateWithCredential(auth.currentUser, EmailAuthProvider.credential(auth.currentUser?.email, password))
    }

    const removeUser = async () => {

        if (!auth.currentUser) {
            return
        }

        // Delete possible avatar from storage
        await deleteObject(ref(storage, `avatars/${auth.currentUser.uid}`))

        // Delete user doc from firestore
        await deleteDoc(doc(db, "users", auth.currentUser.uid))

        // Delete user from auth
        await deleteUser(auth.currentUser)


    }

    const createQuiz = async (data: any) => {

        if (!auth.currentUser) {
            return
        }

        await addDoc(collection(db, "quizzes"), {
            authorId: auth.currentUser.uid,
            createdAt: new Date(),
            ...data
        })

    }

    // Object with variables and functions that children components can use
    const contextValues= {
        currentUser,
        signup,
        signin,
        logout,
        passwordReset,
        getUser,
        updateAccount,
        verifyUser,
        removeUser,
        createQuiz
    }

    // Useeffect to reflect auth changes and apply changes to currentuser variable
    useEffect(()=>{

        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user)
        })

        return unsubscribe

    }, [])

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContextProvider as default,
    useAuthContext
}