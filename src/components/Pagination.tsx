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
            <div 
                onClick={()=>{
                    onPageSwitch(currentPage - 1)
                }}
            >
                {'<'}
            </div>
            {
                pages.map((page) => (
                    <div 
                        key={page} 
                        onClick={()=>{
                            onPageSwitch(page)
                        }}
                    >
                        {page}
                    </div>
                ))
            }
            <div 
                onClick={()=>{
                    onPageSwitch(currentPage + 1)
                }}
            >
                {'>'}
            </div>
        </div>
    )
}

export default Pagination