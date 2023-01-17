interface Props {
    onCancel: () => void,
    message: string,
}

const Alert = ({onCancel, message} : Props) => {

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
                <h2>Error!</h2>
                <p className="confirm-action-text">
                    {message}
                </p>
                <div className="action-btn-container">
                    <button className="btn btn-danger" onClick={onCancel}>Ok</button>
                </div>
            </div>
        </div>
    )

}

export default Alert