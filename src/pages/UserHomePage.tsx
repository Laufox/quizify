import { useAuthContext } from "../contexts/AuthContext"

const UserHomePage = () => {

    const { currentUser } = useAuthContext()

    return (
        <p>Welcome { currentUser.email }</p>
    )
}

export default UserHomePage