
import accordionIcon from '../assets/icons/accordion-icon.svg'
import LoadingSpinnerGeneric from './LoadingSpinnerGeneric'

interface Props {
    children: JSX.Element,
    onToggle: () => void,
    title: string,
    loadingState: boolean,
    showState: boolean
}

const CollectionContainer = ({children, onToggle, title, loadingState, showState}: Props) => {

    return (
        <div className="collection-container">
            <header className={showState ? 'header-open' : 'header-closed'} onClick={onToggle}>
                <h2>{title}</h2>
                <img src={accordionIcon} />
            </header>

            {
                showState && (
                    <main className={showState ? 'main-open' : 'main-closed'}>
                        {
                            loadingState ? (
                                <LoadingSpinnerGeneric size='medium' />
                            ) : (
                                children
                            )
                        }
                    </main>
                )
            }
        </div>
    )
}

export default CollectionContainer