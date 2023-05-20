import { motion } from 'framer-motion'

interface Props {
    children: JSX.Element | JSX.Element[],
    extraClasses?: string,
    encapsulated?: boolean
}

const PageTransition = ({children, extraClasses, encapsulated = false}: Props) => {

    return (
        <motion.div 
            className={extraClasses ? encapsulated ? `${extraClasses}` : `page-container ${extraClasses}` : encapsulated ? "" : "page-container"}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 0.1}}}
            exit={{opacity: 0, transition: {duration: 0.1}}}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition