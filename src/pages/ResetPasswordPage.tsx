import { Link } from "react-router-dom"
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { useAuthContext } from '../contexts/AuthContext'
import { FormData } from '../interfaces/FormData'
import classNames from "classnames"

// type FormData = {
//     email: string
// }

const ResetPasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const { resetUserAccountPassword } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState('')
    const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')

    const loginUser = async (data: any) => {
        console.log(data)

        try {
            await resetUserAccountPassword(data.email)
            setSubmitSuccessMessage('An email has been sent to your email with further instruction on how to reset your password')
        } catch (error: any) {
            setSubmitErrorMessage(error?.message ? error.message : 'An unknown error occured')
        }
    }

    return (
        <div className="page-container">
            <h1>Reset account password</h1>

            <p>Reset your password by filling in your email address below. An email will be sent with further instructions</p>

            <form onSubmit={handleSubmit(loginUser)} noValidate>
                <label>Email</label>
                <input 
                    id="resetemail" 
                    type='email' 
                    {...register('email', {
                        required: 'Please enter email'
                    })}
                    placeholder='name@mail.com'
                    className={classNames({'error-input': errors.email})}
                />
                {errors.email && <span className="form-error-message">{errors.email?.message}</span>}

                {
                    submitErrorMessage && 
                    <p className="submit-error-message">{submitErrorMessage}</p>
                }

                {
                    submitSuccessMessage && 
                    <p className="submit-success-message">{submitSuccessMessage}</p>
                }

                <button type="submit" className="btn btn-info">Reset</button>

                <hr />

                <Link to='/signin'>Go back to sign in page</Link>
                <Link to='/signup'>Don't have an account? Sign up now!</Link>
            </form>
        </div>
    )
}

export default ResetPasswordPage