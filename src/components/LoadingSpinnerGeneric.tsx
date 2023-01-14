interface Props {
    size: 'small' | 'medium' | 'large'
}

const LoadingSpinnerGeneric = ({size}: Props) => {

    return (
        <div className={`loading-spinner-generic-${size}`} />
    )
}

export default LoadingSpinnerGeneric