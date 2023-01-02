interface Props {
    onConfirm: () => void,
    onCancel: () => void,
    actionText: string
}

const Confirm = ({onConfirm, onCancel, actionText}: Props) => {

    return (
        <div 
            className="confirm-outer" 
            onClick={e=>{
                e.stopPropagation()
            }}
        >
            <div className="confirm-inner">
                <h2>Warning!</h2>
                <p>{actionText}</p>
                <p>
                    This action is permanant!
                    <br />
                    Are you sure?
                </p>
                <div className="action-btn-container">
                    <button className="btn btn-confirm" onClick={onConfirm}>Yes</button>
                    <button className="btn btn-danger" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    )
}

export default Confirm