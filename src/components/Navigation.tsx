import { Link } from 'react-router-dom'

const Navigaion = () => {
    return (
        <div className='navigation'>
            <Link to='/'>guest home</Link>
            <Link to='/abc123'>404 page</Link>
            <Link to='/about'>about</Link>
            <Link to='/userhome'>userhome</Link>
        </div>
    )
}

export default Navigaion