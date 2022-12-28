// Dependency import
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

function App() {

    return (
        <div className="App">
            <Navigaion />
            <Routes>
                <Route path='*' element={<NotFoundPage />} />
                <Route path='/' element={<GuestHomePage />} />
                <Route path='/userhome' element={<UserHomePage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/signup' element={<CreateAccountPage />} />
                <Route path='/signin' element={<SignInPage />} />
                <Route path='/createquiz' element={<CreateQuizPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/quizlist' element={<QuizListPage />} />
                <Route path='/quizpage' element={<QuizPage />} />
                <Route path='/resetpassword' element={<ResetPasswordPage />} />
                <Route path='/search' element={<SearchPage />} />
                <Route path='/updateprofile' element={<UpdateProfilePage />} />
                <Route path='/updatequiz' element={<UpdateQuizPage />} />
            </Routes>
        </div>
    )
}

export default App
