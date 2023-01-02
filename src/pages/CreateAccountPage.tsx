/** Page to handle creation of new user accounts */

// React related imports
import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

// Icons to display on website
import defaultAvatar from '../assets/icons/defaultAvatar.svg'

import classNames from "classnames"

type FormData = {
    email: string,
    password: string,
    passwordrepeat: string,
    username: string
}

const CreateAccountPage = () => {

    // Function to jump to different page route
    const navigate = useNavigate()

    // Funtions and variabels to use from auth context
    const { signup } = useAuthContext()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // States for error messages to display within form
    const [submitErrorMessage, setSubmitErrorMessage] = useState('')
    const [imageErrorMessage, setImageErrorMessage] = useState('')

    // State for image url for preview avatar before submitting form
    const [imagePreview, setImagePreview] = useState('')
    // State for image file currently selected for upload on form submit
    const [currentPhoto, setCurrentPhoto] = useState<File | null>(null)

    // Function to request  to sign up new user through auth context
    const createUser = async (data: any) => {

        try {
            await signup(data.email, data.password, data.username, currentPhoto)
            navigate('/')
        } catch (error: any) {
            setSubmitErrorMessage(error?.message)
        }

    }

    // Function to handle when new image file has been selected
    const handlePhotoSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {

        // If no filen was given, reset states data and return early
        if (!e.target.files?.length) {
            setCurrentPhoto(null)
            setImageErrorMessage('')
            setImagePreview('')
            return
        }

        const targetFile = e.target.files[0]
        // If file is not of type image, set error message and return early
        if (targetFile.type.slice(0, targetFile.type.indexOf('/')) !== "image") {
            setImageErrorMessage('File must be an image')
            return
        }
        // Set states with new photo info
        setCurrentPhoto(targetFile)
        setImagePreview(URL.createObjectURL(targetFile))

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

                <label>Username *</label>
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

                <div className="avatar-section">
                    <div className="form-avatar-container">
                        <img src={imagePreview ? imagePreview : defaultAvatar} alt='avatar-image-preview' className="avatar-image-preview" />
                    </div>

                    <label htmlFor="createphoto" className="file-upload-label">
                        <p>Upload profile image</p>
                        <span>Click to open file system or drag directly to this area</span>
                    </label>
                    <input 
                        type="file" 
                        onChange={handlePhotoSelect}
                        id="createphoto"
                    />

                    {
                        currentPhoto &&
                        <p className="photo-name">{currentPhoto.name}</p>
                    }

                    {
                        imageErrorMessage &&
                        <p className="submit-error-message">{imageErrorMessage}</p>
                    }
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