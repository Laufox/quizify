/**
 * 
 * Context to handle authorization of site users
 * 
 **/ 

// React related imports
import { useContext, createContext, useEffect, useState } from "react"

// FIrebase imports
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

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

        // Create new firestore document for the new user
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            email,
            username,
            role: 'user',
            createdAt: new Date(),
        })

        // If a photo was given, upload photo to storage and then asign photo and username to currentuser profile
        if (photo) {
            const uploadPhoto = await uploadBytes(ref(storage, `avatars/${auth.currentUser.uid}`), photo)
            const photoURL = await getDownloadURL(uploadPhoto.ref)

            await updateProfile(auth.currentUser, {
                displayName: username,
                photoURL
            })
        } else {
            await updateProfile(auth.currentUser, {
                displayName: username
            })
        }

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

    // Object with variables and functions that children components can use
    const contextValues= {
        currentUser,
        signup,
        signin,
        logout,
        passwordReset
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