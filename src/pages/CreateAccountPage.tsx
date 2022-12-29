import { Link } from "react-router-dom"
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useAuthContext } from '../contexts/AuthContext'

type FormData = {
    email: string,
    password: string,
    passwordrepeat: string
}

const CreateAccountPage = () => {

    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
    const { signup, currentUser, logout } = useAuthContext()

    const createUser = async (data: any) => {
        console.log(data)

        try {
            await signup(data.email, data.password)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        console.log('Currentuser changed: ', currentUser)
    }, [currentUser])

    return (
        <div className="page-container">
            <h1>Create your account</h1>
            <p>Required fields are marked with *</p>

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
                />
                {errors.email && <span>{errors.email?.message}</span>}

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
                />
                {errors.password && <span>{errors.password?.message}</span>}

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
                />
                {errors.passwordrepeat && <span>{errors.passwordrepeat?.message}</span>}

                <hr />

                <label htmlFor="createusername">Username (if omitted email will be used)</label>
                <input id="createusername" type='text' />

                <div>
                    <p>Avatar</p>
                </div>

                <hr />

                <button type="submit" className="btn btn-info">Create Account</button>

                <Link to='/signin'>Already have an account? sig in instead!</Link>
            </form>
            <button onClick={logout}>log out</button>
        </div>
    )
}

export default CreateAccountPage