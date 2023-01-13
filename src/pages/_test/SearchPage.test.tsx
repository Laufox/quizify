// Imports needed to perform the test itself
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { test, expect } from "vitest";
import userEvent from '@testing-library/user-event'

// Components import to be able to render the main component during tests
import { BrowserRouter } from "react-router-dom";
import SearchPage from "../SearchPage";
import AuthContextProvider from '../../contexts/AuthContext'

test('Renders searchpage', async () => {

    // Making sure the search page component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <SearchPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const headingEl = screen.getByText(/search quizzes and users/i)
    const searchInputEl = screen.getByPlaceholderText(/search.../i)

    // Testing to see that all elements exist on the page
    expect(headingEl).toBeInTheDocument()
    expect(searchInputEl).toBeInTheDocument()

})

test('being able to search and get results heading feedback', async () => {

    // Making sure the search page component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <SearchPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const searchInputEl = screen.getByPlaceholderText(/search.../i)

    // Simulate typing into search field and pressing enter
    await userEvent.click(searchInputEl)
    await userEvent.type(searchInputEl, "test")
    await userEvent.keyboard('{enter}')

    // Finds various elements on the page and saves them to variables
    const subheadingEl = screen.getByText(/showing results for "test"/i)

    // Testing to see that all elements exist on the page
    expect(subheadingEl).toBeInTheDocument()

})