import { Quiz } from "./Quiz";
import { User } from "./User";

export interface SearchResults {
    quizzes: Quiz[]
    users: User[]
}