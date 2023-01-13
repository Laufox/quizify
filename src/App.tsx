/** App component to hold all website content */

// React related imports
import { Routes, Route } from 'react-router-dom'

// Style import
import './assets/scss/App.scss'

// Pages import
import GuestHomePage from './pages/GuestHomePage'
import UserHomePage from './pages/UserHomePage'
import AboutPage from './pages/AboutPage'
import CreateAccountPage from './pages/CreateAccountPage'
import CreateQuizPage from './pages/CreateQuizPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import QuizListPage from './pages/QuizListPage'
import QuizPage from './pages/QuizPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SearchPage from './pages/SearchPage'
import SignInPage from './pages/SignInPage'
import UpdateProfilePage from './pages/UpdateProfilePage'
import UpdateQuizPage from './pages/UpdateQuizPage'

// Component import
import Navigaion from './components/Navigation'

// Context with data and functions for user authentication
import { useAuthContext } from './contexts/AuthContext'
import LoadingSpinner from './components/LoadingSpinner'

function App() {

    // Funtions and variabels to use from auth context
    const { currentUser } = useAuthContext()

    return (
        <div className="App">
            <Navigaion />
            <div className='app-container'>
                <Routes>

                    <Route path='*' element={<NotFoundPage />} />
                    <Route path='/' element={currentUser ? <UserHomePage /> : <GuestHomePage />} />

                    <Route path='/signup' element={<CreateAccountPage />} />
                    <Route path='/signin' element={<SignInPage />} />
                    <Route path='/resetpassword' element={<ResetPasswordPage />} />

                    <Route path='/about' element={<AboutPage />} />

                    <Route path='/quizlist' element={<QuizListPage />} />
                    <Route path='/quiz/:id' element={<QuizPage />} />
                    <Route path='/createquiz' element={<CreateQuizPage />} />
                    <Route path='/updatequiz/:id' element={<UpdateQuizPage />} />

                    <Route path='/profile/:uid' element={<ProfilePage />} />
                    <Route path='/updateprofile/:uid' element={<UpdateProfilePage />} />

                    <Route path='/search' element={<SearchPage />} />
                </Routes>
            </div>
            {/* <LoadingSpinner /> */}
        </div>
    )
}

export default App
