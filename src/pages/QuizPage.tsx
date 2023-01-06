import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuthContext } from '../contexts/AuthContext'

interface quiz {
    authorId: string,
    authorName: string,
    category: string,
    createdAt: string,
    description: string,
    name: string,
    questions: {}[],
    tags: string[],
    visibility: string
}

const QuizPage = () => {

    const { id } = useParams()

    const { getQuizDocument } = useAuthContext()

    const [quiz, setQuiz] = useState<quiz>()

    const applyQuiz = async () => {

        setQuiz(await getQuizDocument(id))

    }

    useEffect(()=>{

        if(id) {
            applyQuiz()
        }

    }, [id])

    useEffect(()=>{

        console.log(quiz)

    }, [quiz])

    return (
        <div className='page-container quiz-container'>
            {
                quiz && (
                    <>
                    <h1>{quiz.name}</h1>
                    <p>
                        Created by 
                        <Link to={`/profile/${quiz.authorId}`} >{quiz.authorName}</Link> 
                        - {quiz.createdAt}
                    </p>
                    <div className='tags-container'>
                        {
                            !!quiz.tags.length && quiz.tags.map((tag, i)=>(
                                <span key={i}>#{tag}</span>
                            ))
                        }
                    </div>
                    <p>
                        {quiz.description}
                    </p>
                    <span>{quiz.questions.length} questions - max time {quiz.questions.length / 2} minutes</span>

                    <button className='btn btn-confirm'>Begin quiz</button>
                    </>
                )
            }
            
        </div>
    )
}

export default QuizPage