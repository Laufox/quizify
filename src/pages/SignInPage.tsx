/** Page to handle sign in of user account  */

// React related imports
import { Link, useNavigate } from "react-router-dom"
import { useState  } from 'react'
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"
import { FormData } from "../interfaces/FormData"
import LoadingSpinnerButton from "../components/LoadingSpinnerButton"

const SignInPage = () => {

    // Function to jump to different page route
    const navigate = useNavigate()
    
    // Funtions and variabels to use from auth context
    const { signinUserAccount, loading } = useAuthContext()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

    // States for error messages to display within form
    const [submitErrorMessage, setSubmitErrorMessage] = useState('')

    // Function to request  to sign in user through auth context
    const loginUser = async (data: any) => {

        const response = await signinUserAccount(data.email, data.password)

        if (!response.success) {

            if (response.error.code === "auth/user-not-found" || response.error.code === "auth/wrong-password") {
                setSubmitErrorMessage('Wrong user credentials')
            } else {
                setSubmitErrorMessage(response.error?.message ?? 'An unknown error occured')
            }
            return
        }

        navigate('/')
    }

    return (
        <div className="page-container">
            <h1>Log in to your account</h1>

            <form onSubmit={handleSubmit(loginUser)} noValidate>
                <label htmlFor="loginemail">Email</label>
                <input 
                    id="loginemail" 
                    type='email' 
                    {...register('email', {
                        required: 'Please enter email'
                    })}
                    placeholder='name@mail.com'
                    className={classNames({'error-input': errors.email})}
                />
                {errors.email && <span className="form-error-message">{errors.email?.message}</span>}

                <label htmlFor="loginpassword">Password</label>
                <input 
                    id="loginpassword" 
                    type='password' 
                    {...register('password', {
                        required: 'Please enter password'
                    })}
                    placeholder='password'
                    className={classNames({'error-input': errors.password})}
                />
                {errors.password && <span className="form-error-message">{errors.password?.message}</span>}

                <Link to='/resetpassword'>Forgotten your password? Click to reset</Link>

                <hr />

                {
                    submitErrorMessage && 
                    <p className="submit-error-message">{submitErrorMessage}</p>
                }

                <button 
                    type="submit" 
                    className={classNames({
                        'btn': true,
                        'btn-info': true,
                        'btn-action': true,
                        'btn-signin': true,
                        'btn-disabled': loading.signinUser
                    })}
                    disabled={loading.signinUser}
                >
                    {
                        loading.signinUser ? (
                            <LoadingSpinnerButton />
                        ) : (
                            'Sign in'
                        )
                    }
                </button>

                <Link to='/signup'>Don't have an account? Sign up now!</Link>
            </form>
        </div>
    )
}

export default SignInPage