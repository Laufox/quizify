import { motion } from 'framer-motion'

interface Props {
    children: JSX.Element | JSX.Element[],
    extraClasses?: string
}

const PageTransition = ({children, extraClasses}: Props) => {

    return (
        <motion.div 
            className={extraClasses ? `page-container ${extraClasses}` : "page-container"}
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {duration: 0.2}}}
            exit={{opacity: 0}}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition