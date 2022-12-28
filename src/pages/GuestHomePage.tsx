import { Link } from 'react-router-dom'

const GuestHomePage = () => {
    return (
        <div className="page-container">
            <h1>Quizify, the ultimate quiz</h1>

            <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic amet odio harum a distinctio quasi incidunt autem provident recusandae adipisci obcaecati, voluptatem quas sint, consectetur porro nihil soluta inventore neque.
            </p>

            <h2>Take the chance, join now!</h2>

            <Link to='/signup' className='btn btn-info'>Sign Up!</Link>

            <h2>Features</h2>

            <div className='features-container'>
                <span className='feature-create'>Create!</span>
                <span className='feature-play'>Play!</span>
                <span className='feature-compete'>Compete!</span>
            </div>

            <h2>Don't miss out, join us!</h2>

            <Link to='/signup' className='btn btn-info'>Sign Up!</Link>
        </div>
    )
}

export default GuestHomePage