import { Link } from "react-router-dom"
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { useAuthContext } from '../contexts/AuthContext'
import { FormData } from '../interfaces/FormData'
import classNames from "classnames"
import LoadingSpinnerButton from "../components/LoadingSpinnerButton"

const ResetPasswordPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
    const { resetUserAccountPassword, loading } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState('')
    const [submitSuccessMessage, setSubmitSuccessMessage] = useState('')

    const resetPassword = async (data: any) => {

        setSubmitErrorMessage('')
        setSubmitSuccessMessage('')
        const respone = await resetUserAccountPassword(data.email)

        if (!respone.success) {
            setSubmitErrorMessage(respone.error.message ?? 'An unknown error has occured')
            return
        }

        setSubmitSuccessMessage('An email has been sent with further instruction on how to reset your password')
        
    }

    return (
        <div className="page-container">
            <h1>Reset account password</h1>

            <p>Reset your password by filling in your email address below. An email will be sent with further instructions</p>

            <form onSubmit={handleSubmit(resetPassword)} noValidate>
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

                <button 
                    type="submit" 
                    className={classNames({
                        'btn': true,
                        'btn-info': true,
                        'btn-action': true,
                        'btn-reset': true,
                        'btn-disabled': loading.resetPassword
                    })}
                    disabled={loading.resetPassword}
                >
                    {
                        loading.resetPassword ? (
                            <LoadingSpinnerButton />
                        ) : (
                            'Reset'
                        )
                    }
                </button>

                <hr />

                <Link to='/signin'>Go back to sign in page</Link>
                <Link to='/signup'>Don't have an account? Sign up now!</Link>
            </form>
        </div>
    )
}

export default ResetPasswordPage