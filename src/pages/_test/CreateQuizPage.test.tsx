// Imports needed to perform the test itself
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { test, expect } from "vitest";
import userEvent from '@testing-library/user-event'

// Components import to be able to render the main component during tests
import { BrowserRouter } from "react-router-dom";
import CreateQuizPage from "../CreateQuizPage";
import AuthContextProvider from '../../contexts/AuthContext'

test('Renders quizpage', async () => {

    // Making sure the search page component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <CreateQuizPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const headingEl = screen.getByText(/create new quiz/i)
    const nameInputEl = screen.getByLabelText(/^quiz name/i)
    const categorySelectEl = screen.getByLabelText(/^category/i)
    const descTextAreaEl = screen.getByLabelText(/^description/i)
    const tagsTextAreaEl = screen.getByLabelText(/^tags/i)
    const questionnameInputEl = screen.getByLabelText(/^question/i)
    const correctanswerInputEl = screen.getByLabelText(/^correct answer/i)
    const otherAlternativeInputEls = screen.getAllByLabelText(/^other alternative/i)
    const addButtonEls = screen.getAllByRole('button')

    // Testing to see that all elements exist on the page
    expect(headingEl).toBeInTheDocument()
    expect(nameInputEl).toBeInTheDocument()
    expect(categorySelectEl).toBeInTheDocument()
    expect(descTextAreaEl).toBeInTheDocument()
    expect(tagsTextAreaEl).toBeInTheDocument()
    expect(questionnameInputEl).toBeInTheDocument()
    expect(correctanswerInputEl).toBeInTheDocument()
    expect(otherAlternativeInputEls.length).toBe(3)
    expect(addButtonEls.length).toBe(2)

})

test('fill out question form and add it to questions list', async () => {

    // Making sure the search page component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <CreateQuizPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const questionnameInputEl = screen.getByLabelText(/^question/i)
    const correctanswerInputEl = screen.getByLabelText(/^correct answer/i)
    const otherAlternativeInputEls = screen.getAllByLabelText(/^other alternative/i)
    const addButtonEl :any = screen.getByRole('button', {
        name: /add/i
    })

    await userEvent.type(questionnameInputEl, "testq")
    await userEvent.type(correctanswerInputEl, "ansC")
    await userEvent.type(otherAlternativeInputEls[0], "wrong1")
    await userEvent.type(otherAlternativeInputEls[1], "wrong2")
    await userEvent.type(otherAlternativeInputEls[2], "wrong3")
    await userEvent.click(addButtonEl)

    const headingEl = screen.getByText(/current added questions:/i)
    const addedQuestionNumberSpanEl = screen.getByText(/#1/i)

    expect(headingEl).toBeInTheDocument()
    expect(addedQuestionNumberSpanEl).toBeInTheDocument()

})

test('Get error message when not filling out all required fields', async () => {

    // Making sure the search page component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <CreateQuizPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const questionnameInputEl = screen.getByLabelText(/^question/i)
    const correctanswerInputEl = screen.getByLabelText(/^correct answer/i)
    const otherAlternativeInputEls = screen.getAllByLabelText(/^other alternative/i)
    const addButtonEl :any = screen.getByRole('button', {
        name: /add/i
    })
    const publishButtonEl :any = screen.getByRole('button', {
        name: /publish/i
    })

    await userEvent.type(questionnameInputEl, "testq")
    await userEvent.type(correctanswerInputEl, "ansC")
    await userEvent.type(otherAlternativeInputEls[0], "wrong1")
    await userEvent.type(otherAlternativeInputEls[1], "wrong2")
    await userEvent.type(otherAlternativeInputEls[2], "wrong3")
    await userEvent.click(addButtonEl)

    await userEvent.click(publishButtonEl)

    const quizNameErrorEl = screen.getByText(/name of quiz is required/i)
    const quizCategoryErrorEl = screen.getByText(/must choose category/i)

    expect(quizNameErrorEl).toBeInTheDocument()
    expect(quizCategoryErrorEl).toBeInTheDocument()

})