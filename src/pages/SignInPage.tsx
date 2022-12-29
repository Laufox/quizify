import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useAuthContext } from '../contexts/AuthContext'
import classNames from "classnames"

type FormData = {
    email: string,
    password: string,
}

const SignInPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const { signin, currentUser } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState('')

    const navigate = useNavigate()

    const loginUser = async (data: any) => {
        console.log(data)

        try {
            await signin(data.email, data.password)
            navigate('/')
        } catch (error: any) {
            if (error?.code === "auth/user-not-found" || error?.code === "auth/wrong-password") {
                setSubmitErrorMessage('Wrong user credentials')
                return
            }
            setSubmitErrorMessage(error?.message ? error.message : 'An unknown error occured')
        }
    }

    return (
        <div className="page-container">
            <h1>Log in to your account</h1>

            <form onSubmit={handleSubmit(loginUser)} noValidate>
                <label>Email</label>
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

                <label>Password</label>
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

                <button type="submit" className="btn btn-info">Sign in</button>

                <Link to='/signup'>Don't have an account? Sign up now!</Link>
            </form>
        </div>
    )
}

export default SignInPage