import { QuizResults } from "./QuizResults";

export interface UserData {
    uid: string,
    username: string,
    photoURL: string,
    email: string,
    role: string,
    playedQuizzes: QuizResults[]
}