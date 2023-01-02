import { Link } from 'react-router-dom'

const GuestHomePage = () => {
    return (
        <div className="page-container">
            <div className='homepage-guest-intro'>
                <h1>Quizify, the ultimate quiz</h1>

                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic amet odio harum a distinctio quasi incidunt autem provident recusandae adipisci obcaecati, voluptatem quas sint, consectetur porro nihil soluta inventore neque.
                </p>
            </div>

            <div className='homepage-guest-cta'>
                <h2>Take the chance, join now!</h2>

                <Link to='/signup' className='btn btn-info'>Sign Up!</Link>
            </div>

            <div className='homepage-guest-features'>
                <h2>Features</h2>

                <div className='features-container'>
                    <span className='feature-create'>Create!</span>
                    <span className='feature-play'>Play!</span>
                    <span className='feature-compete'>Compete!</span>
                </div>
            </div>

            <div className='homepage-guest-cta'>
                <h2>Don't miss out, join us!</h2>

                <Link to='/signup' className='btn btn-info'>Sign Up!</Link>
            </div>
        </div>
    )
}

export default GuestHomePage