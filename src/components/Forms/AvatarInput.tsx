// React related imports
import { useState, useEffect } from 'react'

// Icons to display on website
import defaultAvatar from '../../assets/icons/defaultAvatar.svg'

interface Props {
    currentPhoto: File | Blob | null,
    setCurrentPhoto: React.Dispatch<React.SetStateAction<File | Blob | null>>,
    defaultImageUrl: string
}

const AvatarInput = ({currentPhoto, setCurrentPhoto, defaultImageUrl}: Props) => {

    const [imageErrorMessage, setImageErrorMessage] = useState('')

    // State for image url for preview avatar before submitting form
    const [imagePreview, setImagePreview] = useState('')

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

    useEffect(()=>{

        if (!defaultImageUrl) {
            return
        }

        setImagePreview(defaultImageUrl)

        const applyInitialCurrentPhoto = async () => {

            setCurrentPhoto(await fetch(defaultImageUrl).then(res => res.blob()))

        }
        applyInitialCurrentPhoto()

    }, [defaultImageUrl])

    return (

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

    )
}

export default AvatarInput