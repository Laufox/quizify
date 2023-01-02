

// React related imports
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

// Icons to display on website
import defaultAvatar from '../assets/icons/defaultAvatar.svg'

import classNames from "classnames"

interface userData {
    uid: string,
    username: string,
    photoURL: string,
    email: string
}

type FormData = {
    email: string,
    password: string,
    passwordrepeat: string,
    currentpassword: string,
    username: string
}

const UpdateProfilePage = () => {

    // Function to jump to different page route
    const navigate = useNavigate()

    // Funtions and variabels to use from auth context
    const { getUser, currentUser, updateAccount, verifyUser } = useAuthContext()

    const { uid } = useParams()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // State with data about current signed in user
    const [userData, setUserData] = useState<userData>()

    // States for error messages to display within form
    const [submitErrorMessage, setSubmitErrorMessage] = useState('')
    const [imageErrorMessage, setImageErrorMessage] = useState('')

    // State for image url for preview avatar before submitting form
    const [imagePreview, setImagePreview] = useState('')
    // State for image file currently selected for upload on form submit
    const [currentPhoto, setCurrentPhoto] = useState<File | null>(null)

    // Function to request  to sign up new user through auth context
    const updateUser = async (data: any) => {

        try {

            if ((data.password && data.passwordrepeat && data.currentpassword) || (data.email !== currentUser.email)) {
                await verifyUser(data.currentpassword)
            }

            await updateAccount(
                data.email !== currentUser.email ? data.email : null, 
                data.password ?? null, 
                data.username, 
                currentPhoto,
                imagePreview ? false : true
            )
            navigate(`/profile/${currentUser.uid}`)
        } catch (error: any) {
            setSubmitErrorMessage(error?.message)
        }

    }

    // Function to handle when new image file has been selected
    const handlePhotoSelect: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        console.log('hello')
        // If no filen was given, reset states data and return early
        if (!e.target.files?.length) {
            console.log('hello')
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

    const handleRemoveImage = () => {
        setImagePreview('')
    }

    useEffect(()=>{

        const asyncFunction = async () => {
            try {
                setUserData(await getUser(uid))
            } catch (error) {
                console.log(error)
            }
        }

        if (uid) {
            asyncFunction()
        }

    }, [uid])

    useEffect(()=>{

        if (userData?.photoURL) {
            setImagePreview(userData.photoURL)
        }

    }, [userData])

    return (
        <div className="page-container">
            <h1>Update your account</h1>

            {
                currentUser && userData && currentUser.uid === uid && (

                    <form onSubmit={handleSubmit(updateUser)} noValidate>
                        <label>Username</label>
                        <input 
                            id="createusername" 
                            type='text' 
                            {...register('username', {
                                required: 'Username is required'
                            })}
                            placeholder='username'
                            className={classNames({'error-input': errors.username})}
                            defaultValue={userData.username}
                        />
                        {errors.username && <span className="form-error-message">{errors.username?.message}</span>}

                        <div className="avatar-section">
                            <div className="form-avatar-container">
                                <img src={imagePreview ? imagePreview : defaultAvatar} alt='avatar-image-preview' className="avatar-image-preview" />
                            </div>
                            {
                                imagePreview &&
                                <p className='link' onClick={handleRemoveImage}>Remove image</p>
                            }

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

                        <label>Email</label>
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
                            defaultValue={userData.email}
                        />
                        {errors.email && <span className="form-error-message">{errors.email?.message}</span>}

                        <label>New password</label>
                        <input 
                            id="createpassword" 
                            type='password' 
                            {...register('password', {
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least six characters'
                                }
                            })}
                            placeholder='password'
                            className={classNames({'error-input': errors.password})}
                        />
                        {errors.password && <span className="form-error-message">{errors.password?.message}</span>}

                        <label>Repeat new password</label>
                        <input 
                            id="createpasswordrepeat" 
                            type='password' 
                            {...register('passwordrepeat', {
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

                        <label>Current password</label>
                        <input 
                            id="currentpassword" 
                            type='password' 
                            {...register('currentpassword', {
                                validate: (val: string) => {
                                    if (watch('password') && !val) {

                                        return 'You need to enter your current password to change to a new password'
                                    }
                                }
                            })}
                            placeholder='current password'
                            className={classNames({'error-input': errors.currentpassword})}
                        />
                        {errors.currentpassword && <span className="form-error-message">{errors.currentpassword?.message}</span>}

                        <hr />

                        {
                            submitErrorMessage && 
                            <p className="submit-error-message">{submitErrorMessage}</p>
                        }

                        <button type="submit" className="btn btn-info">Save</button>

                    </form>
                )
            }
            
        </div>
    )
}

export default UpdateProfilePage