import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

const Navigaion = () => {

    const navigate = useNavigate()

    const { logout } = useAuthContext()

    const signOut = async () => {
        try {
            await logout()
            navigate('/')
        } catch (error: any) {
            console.log(error?.message)
        }
    }

    return (
        <div className='navigation'>
            <Link to='/'>guest home</Link>
            <Link to='/abc123'>404 page</Link>
            <Link to='/about'>about</Link>
            <Link to='/signin'>signin</Link>
            <p className='link' onClick={signOut}>logout</p>
        </div>
    )
}

export default Navigaion