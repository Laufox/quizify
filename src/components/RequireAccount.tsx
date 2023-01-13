import { Navigate } from 'react-router-dom'
import { useAuthContext } from "../contexts/AuthContext"

interface Props {
    children: JSX.Element
}

const RequireAccount = ({children}: Props) => {

    const { currentUser } = useAuthContext()

    return (
        
        currentUser ? (
            children
        ) : (
            <Navigate to='/' />
        )
        
    )
}

export default RequireAccount