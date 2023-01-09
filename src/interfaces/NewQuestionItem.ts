export interface NewQuestionItem {
    questionText: string,
    answers: {
        isCorrect: boolean,
        text: string
    }[]
}