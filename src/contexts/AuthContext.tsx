import { useContext, createContext, useEffect, useState } from "react"
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db, storage } from '../firebase'

const AuthContext = createContext<any>(undefined)

const useAuthContext = () => {
    return useContext(AuthContext)
}

const AuthContextProvider = ({ children }: any) => {

    const [currentUser, setCurrentUser] = useState<any>()

    const signup = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
        return signOut(auth)
    }

    const contextValues= {
        currentUser,
        signup,
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