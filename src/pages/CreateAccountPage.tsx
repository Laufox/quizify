import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useAuthContext } from '../contexts/AuthContext'
import classNames from "classnames"

type FormData = {
    email: string,
    password: string,
    passwordrepeat: string
}

const CreateAccountPage = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
    const { signup, currentUser } = useAuthContext()

    const [submitErrorMessage, setSubmitErrorMessage] = useState('')

    const navigate = useNavigate()

    const createUser = async (data: any) => {
        console.log(data)

        try {
            await signup(data.email, data.password)
            navigate('/')
        } catch (error: any) {
            setSubmitErrorMessage(error?.message)
        }
    }

    return (
        <div className="page-container">
            <h1>Create your account</h1>

            <form onSubmit={handleSubmit(createUser)} noValidate>
                <label>Email *</label>
                <input 
                    id="createemail" 
                    type='email' 
                    {...register('email', {
                        required: 'Please enter email',
                        pattern: {
                            value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/gi, 
                            message: 'incorrect email format'
                        }
                    })}
                    placeholder='name@mail.com'
                    className={classNames({'error-input': errors.email})}
                />
                {errors.email && <span className="form-error-message">{errors.email?.message}</span>}

                <label>Password *</label>
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

                <label>Repeat password *</label>
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

                <label htmlFor="createusername">Username (if omitted email will be used)</label>
                <input id="createusername" type='text' />

                <div className="avatar-section">
                    <label>Avatar</label>
                    <div className="form-avatar-container">

                    </div>

                    <input type="file" 
                    />
                </div>

                <hr />

                {
                    submitErrorMessage && 
                    <p className="submit-error-message">{submitErrorMessage}</p>
                }

                <button type="submit" className="btn btn-info">Create Account</button>

                <Link to='/signin'>Already have an account? sig in instead!</Link>
            </form>
        </div>
    )
}

export default CreateAccountPage