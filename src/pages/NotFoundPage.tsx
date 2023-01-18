import { Link, useNavigate } from "react-router-dom"
import PageTransition from "../components/PageTransition"

const NotFoundPage = () => {

    const navigate = useNavigate()

    return (
        <PageTransition>
            <h1>404 Page not found</h1>
            <p>The web address you entered is not a page on this website. If it worked before, it seems to have been removed or changed. Make sure to check your spelling.</p>

            <h2>Hese is some pages that do exists</h2>

            <div className="link-collection">
                <Link to='/'>Go to homepage</Link>
                <Link to='/quizlist'>Go to quiz list</Link>
                <p className="link" onClick={()=>{navigate(-1)}}>Go back to previous page</p>
            </div>
        </PageTransition>
    )
}

export default NotFoundPage