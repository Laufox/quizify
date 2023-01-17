import classNames from "classnames"

interface Props {
    items: any[],
    currentPage: number,
    onPageSwitch: (page: number) => void
}

const Pagination = ({items, currentPage, onPageSwitch}: Props) => {

    const pages = []

    for (let i = 1; i <= Math.ceil(items.length / 10); i++) {
        pages.push(i)
    }

    return (
        <div className="pagination-container">
            <button 
                className={classNames({
                    'btn': true,
                    'btn-disabled': currentPage === 1
                })}
                onClick={()=>{
                    onPageSwitch(currentPage - 1)
                }}
                disabled={currentPage === 1}
            >
                {'<'}
            </button>
            {
                pages.map((page) => (
                    <button 
                        key={page} 
                        className={classNames({
                            'btn': true,
                            'btn-selected': currentPage === page
                        })}
                        onClick={()=>{
                            if (currentPage !== page) {
                                onPageSwitch(page)
                            }
                        }}
                        disabled={currentPage === page}
                    >
                        {page}
                    </button>
                ))
            }
            <button 
                className={classNames({
                    'btn': true,
                    'btn-disabled': currentPage === pages.length
                })}
                onClick={()=>{
                    onPageSwitch(currentPage + 1)
                }}
                disabled={currentPage === pages.length}
            >
                {'>'}
            </button>
        </div>
    )
}

export default Pagination