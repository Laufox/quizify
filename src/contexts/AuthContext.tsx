import { useContext, createContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db, storage } from '../firebase'
import { doc, setDoc } from 'firebase/firestore'

const AuthContext = createContext<any>(undefined)

const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthContextProvider = ({ children }: any) => {

    const [currentUser, setCurrentUser] = useState<any>()

    const signup = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password)

        if (!auth.currentUser) {
            return
        }

        await setDoc(doc(db, 'users', auth.currentUser.uid), {
            email,
            role: 'user',
            createdAt: new Date()
        })
    }

    const signin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const contextValues= {
        currentUser,
        signup,
        signin,
        logout
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