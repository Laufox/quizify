import { useAuthContext } from "../contexts/AuthContext"

const UserHomePage = () => {

    const { currentUser } = useAuthContext()

    return (
        <p>Welcome { currentUser.displayName }</p>
    )
}

export default UserHomePage