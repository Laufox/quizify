

// React related imports
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import { FormData } from '../interfaces/FormData'
import { UserData } from '../interfaces/UserData'

import classNames from "classnames"
import Confirm from '../components/Confirm'
import AvatarInput from '../components/Forms/AvatarInput'
import LoadingSpinnerButton from '../components/LoadingSpinnerButton'

const UpdateProfilePage = () => {

    // Function to jump to different page route
    const navigate = useNavigate()

    // Funtions and variabels to use from auth context
    const { getUserDocument, currentUser, updateUserAccount, verifyUserAccount, deleteUserAccount, loading } = useAuthContext()

    const { uid } = useParams()

    // Functions to use from react-hook-form
    const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()

    // State with data about current signed in user
    const [userData, setUserData] = useState<UserData>()

    // States for error messages to display within form
    const [submitErrorMessage, setSubmitErrorMessage] = useState('')

    // State for image url for preview avatar before submitting form
    const [imagePreview, setImagePreview] = useState('')
    // State for image file currently selected for upload on form submit
    const [currentPhoto, setCurrentPhoto] = useState<File | Blob | null>(null)

    const [openConfirm, setOpenConfirm] = useState(false)

    // Function to request  to sign up new user through auth context
    const updateUser = async (data: any) => {

        setSubmitErrorMessage('')
        
        const response = await updateUserAccount(
            data.email !== currentUser.email ? data.email : null, 
            data.password ?? null, 
            data.currentpassword ?? null,
            data.username, 
            currentPhoto,
        )

        if (!response.success) {

            setSubmitErrorMessage(response.error?.message ?? 'An unknown error occured')
            return

        }

        navigate(`/profile/${currentUser.uid}`)

    }

    const handleDeleteUser = async () => {

        setSubmitErrorMessage('')
        closeConfirmModal()

        const response = await deleteUserAccount()

        if (!response.success) {

            setSubmitErrorMessage(response.error?.message ?? 'An unknown error occured')

            return

        }

        navigate('/')

    }

    const openConfirmModal = () => {
        setOpenConfirm(true)
    }

    const closeConfirmModal = () => {
        setOpenConfirm(false)
    }

    useEffect(()=>{

        const asyncFunction = async () => {
            try {
                setUserData(await getUserDocument(uid))
            } catch (error) {
                console.log(error)
            }
        }

        if (uid) {
            asyncFunction()
        }

    }, [uid])

    useEffect(()=>{

        if (!userData?.photoURL) {
            return
        }
        setImagePreview(userData.photoURL)

    }, [userData])

    return (
        <div className="page-container">
            <h1>Update your account</h1>

            {
                currentUser && userData && currentUser.uid === uid && (

                    <>
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

                        <AvatarInput currentPhoto={currentPhoto} setCurrentPhoto={setCurrentPhoto} defaultImageUrl={imagePreview} />

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
                                    if ((watch('password') || (watch('email') !== userData.email)) && !val) {
                                        return 'You need to enter your current password to change to a new password/email'
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

                        <button 
                            type="submit" 
                            className={classNames({
                                'btn': true,
                                'btn-info': true,
                                'btn-action': true,
                                'btn-update-user': true,
                                'btn-disabled': loading.updateUser
                            })}
                            disabled={loading.updateUser}
                        >
                            {
                                loading.updateUser ? (
                                    <LoadingSpinnerButton />
                                ) : (
                                    'Save'
                                )
                            }
                        </button>

                    </form>

                    <hr />
                    <div className='danger-zone'>
                        <h2>Danger zone</h2>
                        <button 
                            className={classNames({
                                'btn': true,
                                'btn-danger': true,
                                'btn-action': true,
                                'btn-delete-user': true,
                                'btn-disabled': loading.deleteUser
                            })}
                            onClick={openConfirmModal}
                            disabled={loading.deleteUser}
                        >
                            {
                                loading.deleteUser ? (
                                    <LoadingSpinnerButton />
                                ) : (
                                    'Delete Account'
                                )
                            }
                        </button>
                    </div>

                    

                    </>
                )
            }

            {
                openConfirm &&
                <Confirm 
                    onConfirm={handleDeleteUser}
                    onCancel={closeConfirmModal}
                    actionText='You are about to delete this account'
                    requiresAuth={true}
                />
            }
            
        </div>
    )
}

export default UpdateProfilePage