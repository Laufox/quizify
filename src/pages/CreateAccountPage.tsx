/** Page to handle creation of new user accounts */

// React related imports
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import { FormData } from '../interfaces/FormData'

import classNames from "classnames"
import AvatarInput from '../components/Forms/AvatarInput'
import LoadingSpinnerButton from '../components/LoadingSpinnerButton'

const CreateAccountPage = () => {

    // Function to jump to different page route
    const navigate = useNavigate()

    // Funtions and variabels to use from auth context
    const { createUserAccount, loading } = useAuthContext()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // States for error messages to display within form
    const [submitErrorMessage, setSubmitErrorMessage] = useState('')

    // State for image file currently selected for upload on form submit
    const [currentPhoto, setCurrentPhoto] = useState<File | Blob | null>(null)

    // Function to request  to sign up new user through auth context
    const createUser = async (data: any) => {

        setSubmitErrorMessage('')

        const response = await createUserAccount(data.email, data.password, data.username, currentPhoto)

        if (!response.success) {
            setSubmitErrorMessage(response.error.message ?? 'An unknown error occured')
            return
        }

        navigate('/')

    }

    return (
        <div className="page-container">
            <h1>Create your account</h1>

            <form onSubmit={handleSubmit(createUser)} noValidate>
                <label htmlFor='createemail'>Email *</label>
                <input 
                    id="createemail" 
                    type='email' 
                    {...register('email', {
                        required: 'Please enter email',
                        pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi, 
                            message: 'Incorrect email format'
                        }
                    })}
                    placeholder='name@mail.com'
                    className={classNames({'error-input': errors.email})}
                />
                {errors.email && <span className="form-error-message">{errors.email?.message}</span>}

                <label htmlFor='createpassword'>Password *</label>
                <input 
                    id="createpassword" 
                    type='password' 
                    {...register('password', {
                        required: 'Please enter password',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least six characters'
                        }
                    })}
                    placeholder='password'
                    className={classNames({'error-input': errors.password})}
                />
                {errors.password && <span className="form-error-message">{errors.password?.message}</span>}

                <label htmlFor='createpasswordrepeat'>Repeat password *</label>
                <input 
                    id="createpasswordrepeat" 
                    type='password' 
                    {...register('passwordrepeat', {
                        required: 'Please repeat password',
                        validate: (val: string) => {
                            if (watch('password') !== val) {
                                return 'Password does not match'
                            }
                        }
                    })}
                    placeholder='repeat password'
                    className={classNames({'error-input': errors.passwordrepeat})}
                />
                {errors.passwordrepeat && <span className="form-error-message">{errors.passwordrepeat?.message}</span>}

                <hr />

                <label htmlFor='createusername'>Username *</label>
                <input 
                    id="createusername" 
                    type='text' 
                    {...register('username', {
                        required: 'Username is required'
                    })}
                    placeholder='username'
                    className={classNames({'error-input': errors.username})}
                />
                {errors.username && <span className="form-error-message">{errors.username?.message}</span>}

                <AvatarInput currentPhoto={currentPhoto} setCurrentPhoto={setCurrentPhoto} defaultImageUrl='' />

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
                        'btn-create-account': true,
                        'btn-disabled': loading.createUser
                    })} 
                    disabled={loading.createUser}
                >
                    {
                        loading.createUser ? (
                            <LoadingSpinnerButton />
                        ) : (
                            'Create Account'
                        )
                    }
                </button>

                <Link to='/signin'>Already have an account? sign in instead!</Link>
            </form>
        </div>
    )
}

export default CreateAccountPage