import { NewQuestionItem } from "./NewQuestionItem";

export interface Quiz {
    id: string,
    authorId: string,
    authorName: string,
    name: string,
    category: string,
    description: string,
    tags: string[],
    questions: NewQuestionItem[],
    visibility: string
    createdAt: string,
}