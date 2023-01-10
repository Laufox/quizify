export interface AnsweredQuestion {
    guess: string,
    questionText: string,
    answers: {
        isCorrect: boolean,
        text: string
    }[]
}