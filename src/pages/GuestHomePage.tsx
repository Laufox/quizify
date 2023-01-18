import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

const GuestHomePage = () => {
    return (
        <PageTransition>
            <div className='homepage-guest-intro'>
                <h1>Quizify, the ultimate quiz application</h1>

                <p>
                    Welcome to Quizify, where you have the chance to try out your knowledge about a wide range of categories and topics, all of them defined and written by other quizzers! Everyone can find and play quizzes published, but with an account you can also create a new quiz, within a topic and amount of questions of your own choosing.
                </p>
            </div>

            <div className='homepage-guest-cta'>
                <h2>Take the chance, join now!</h2>

                <div className='homepage-buttons'>
                    <Link to='/signup' className='btn btn-info'>Sign Up!</Link>
                    <Link to='/login' className='btn btn-info-open'>Sign in</Link>
                </div>
            </div>

            <div className='homepage-guest-features'>
                <h2>What this site features:</h2>

                <div className='features-container'>
                    <div className='feature feature-create'>
                        <h3>Create!</h3>
                        <p>
                            Make your own set of questions to challenge others about knowledge within a category of your choosing! You can set your quizzes to be either public or private, making it possible to create a quiz for any target group, be it your family, work group or the entire planet!
                        </p>
                    </div>
                    <div className='feature feature-play'>
                        <h3>Play!</h3>
                        <p>
                            Test your knowledge in any of the user - genereated quizzes published on this site! Find a quiz suitable for you, by searching through the public list of quizzes, filterable by category.
                        </p>
                        <Link to='quizlist'>List of public quizzes can be found here</Link>
                    </div>
                    <div className='feature feature-compete'>
                        <h3>Compete!</h3>
                        <p>
                            The score of your previously played quizzes are saved in your profile, and you can always try it again to improve your score. Or why not see if you can perform better than your firends?
                        </p>
                    </div>
                </div>
            </div>

            <div className='homepage-guest-cta'>
                <h2>Don't miss out, join us!</h2>

                <div className='homepage-buttons'>
                    <Link to='/signup' className='btn btn-info'>Sign Up!</Link>
                    <Link to='/login' className='btn btn-info-open'>Sign in</Link>
                </div>
            </div>
        </PageTransition>
    )
}

export default GuestHomePage