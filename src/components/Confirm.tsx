import { useRef, useState } from 'react'

// Context with data and functions for user authentication
import { useAuthContext } from '../contexts/AuthContext'

import classNames from "classnames"

interface Props {
    onConfirm: () => void,
    onCancel: () => void,
    actionText: string,
    requiresAuth: boolean
}

const Confirm = ({onConfirm, onCancel, actionText, requiresAuth}: Props) => {

    const { verifyUser } = useAuthContext()

    const confirmPasswordRef = useRef<HTMLInputElement>(null)
    const [firebaseError, setFirebaseError] = useState('')
    const [inputError, setInputError] = useState('')

    const handleConfirm = async () => {

        try {

            if (requiresAuth) {
                if (!confirmPasswordRef.current?.value) {
                    setInputError('You need to confirm your password')
                    return
                }
                await verifyUser(confirmPasswordRef.current.value)
            }

            onConfirm()
            
        } catch (error: any) {
            setFirebaseError(error?.message)
        }
        

    }

    return (
        <div 
            className="confirm-outer" 
            onClick={onCancel}
        >
            <div className="confirm-inner"
                onClick={e =>{
                    e.stopPropagation()
                }}
            >
                <h2>Warning!</h2>
                <p className="confirm-action-text">{actionText}</p>
                {
                    requiresAuth && (
                            
                        <>
                        <div className='confirm-password-container'>
                            <h3>This action requires you to re-enter your password</h3>
                            <input 
                                id="confirmpassword" 
                                type='password'
                                ref={confirmPasswordRef}
                                placeholder='password'
                                className={classNames({'error-input': inputError})}
                            />
                        </div>
                        {inputError && <span className="form-error-message">{inputError}</span>}

                        {
                            firebaseError && 
                            <p className="submit-error-message">{firebaseError}</p>
                        }
                        </>
                    )
                }
                <p className='confirm-permanent-message'>
                    This action is permanent!
                    <br />
                    Are you sure?
                </p>
                <div className="action-btn-container">
                    <button className="btn btn-confirm" onClick={handleConfirm}>Yes</button>
                    <button className="btn btn-danger" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    )
}

export default Confirm