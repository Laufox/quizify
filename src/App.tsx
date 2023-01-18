/** App component to hold all website content */

// React related imports
import { Routes, Route, useLocation } from 'react-router-dom'

import { AnimatePresence } from 'framer-motion'

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
import RequireAccount from './components/RequireAccount'

// Context with data and functions for user authentication
import { useAuthContext } from './contexts/AuthContext'
import RequireGuest from './components/RequireGuest'

function App() {

    const location = useLocation()

    // Funtions and variabels to use from auth context
    const { currentUser } = useAuthContext()

    return (
        <div className="App">
            <Navigaion />
            <div className='app-container'>
                <AnimatePresence mode='wait'>
                    <Routes location={location} key={location.pathname}>

                        {/* 404 PAGE FOR UNKNOWN ADDRESS */}
                        <Route 
                            path='*' 
                            element={
                                <NotFoundPage />
                            } 
                        />

                        {/* START PAGE */}
                        <Route 
                            path='/' 
                            element={
                                currentUser 
                                ? <UserHomePage /> 
                                : <GuestHomePage />
                            } 
                        />

                        {/* ACCOUNT CREATION, SIGN IN AND RESET PASSWORD PAGES */}
                        <Route 
                            path='/signup' 
                            element={
                                <RequireGuest>
                                    <CreateAccountPage />
                                </RequireGuest>
                            } 
                        />
                        <Route 
                            path='/signin' 
                            element={
                                <SignInPage />
                            } 
                        />
                        <Route 
                            path='/resetpassword' 
                            element={
                                <RequireGuest>
                                    <ResetPasswordPage />
                                </RequireGuest>
                            }
                        />

                        {/* VIEW AND UPDATE PROFILE PAGES */}
                        <Route 
                            path='/profile/:uid' 
                            element={
                                <ProfilePage />
                            } 
                        />
                        <Route 
                            path='/updateprofile/:uid' 
                            element={
                                <RequireAccount>
                                    <UpdateProfilePage />
                                </RequireAccount>
                            } 
                        />

                        {/* LIST, VIEW, CREATE AND UPDATE QUIZ PAGES */}
                        <Route 
                            path='/quizlist' 
                            element={
                                <QuizListPage />
                            } 
                        />
                        <Route 
                            path='/quiz/:id' 
                            element={
                                <QuizPage />
                            } 
                        />
                        <Route 
                            path='/createquiz' 
                            element={
                                <RequireAccount>
                                    <CreateQuizPage />
                                </RequireAccount>
                            } 
                        />
                        <Route 
                            path='/updatequiz/:id' 
                            element={
                                <RequireAccount>
                                    <UpdateQuizPage />
                                </RequireAccount>
                            } 
                        />

                        {/* SEARCH PAGE */}
                        <Route 
                            path='/search' 
                            element={
                                <SearchPage />
                            } 
                        />

                        {/* ABOUT WEBSITE PAGE */}
                        <Route 
                            path='/about' 
                            element={
                                <AboutPage />
                            } 
                        />

                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default App
