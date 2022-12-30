import { useContext, createContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

const AuthContext = createContext<any>(undefined)

const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthContextProvider = ({ children }: any) => {

    const [currentUser, setCurrentUser] = useState<any>()

    const signup = async (email: string, password: string, username: string, photo: File) => {
        await createUserWithEmailAndPassword(auth, email, password)

        if (!auth.currentUser) {
            return
        }

        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            email,
            username,
            role: 'user',
            createdAt: new Date(),
        })

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

    const signin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const passwordReset = async (email: string) => {
        await sendPasswordResetEmail(auth, email)
    }

    const contextValues= {
        currentUser,
        signup,
        signin,
        logout,
        passwordReset
    }

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