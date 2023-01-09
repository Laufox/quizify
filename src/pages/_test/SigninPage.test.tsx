// Imports needed to perform the test itself
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { test, expect } from "vitest";
import userEvent from '@testing-library/user-event'

// Components import to be able to render the main component during tests
import { BrowserRouter } from "react-router-dom";
import SignInPage from "../SignInPage";
import AuthContextProvider from '../../contexts/AuthContext'

test('Renders sign in form', async () => {

    // Making sure the create account component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <SignInPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const headingEl = screen.getByText(/log in to your account/i)
    const emailInputEl = screen.getByLabelText(/^email/i)
    const passwordInputEl = screen.getByLabelText(/^password/i)
    const submitButton = screen.getByRole('button')

    // Testing to see that all elements exist on the page
    expect(headingEl).toBeInTheDocument()
    expect(emailInputEl).toBeInTheDocument()
    expect(passwordInputEl).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

})

test('Getting error feedback when typing invalid data', async () => {

    // Making sure the create account component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <SignInPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const submitButton :HTMLButtonElement = screen.getByRole('button')
    
    // Simulate click on submit button
    await userEvent.click(submitButton)

    // Array for elements with eror messages
    const errorEls = screen.queryAllByText(/please enter email|please enter password/i)

    // Makes sure error messages has expected length
    expect(errorEls.length).toBe(2)

})

test('Filling in and submitting the form', async () => {

    // Making sure the create account component renders/loads
    await act(async ()=>{
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <SignInPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const emailInputEl :HTMLInputElement = screen.getByLabelText(/^email/i)
    const passwordInputEl :HTMLInputElement = screen.getByLabelText(/^password/i)
    const submitButton :HTMLButtonElement = screen.getByRole('button')

    // Attempt to type in input fields
    await userEvent.type(emailInputEl, 'mail@mail.com')
    await userEvent.type(passwordInputEl, 'abc123')
    
    // Make sure text was entered
    expect(emailInputEl.value).toBe('mail@mail.com')
    expect(passwordInputEl.value).toBe('abc123')

    // Simulate click on submit button
    await userEvent.click(submitButton)

    // Array for elements with eror messages
    const errorEls = screen.queryAllByText(/please enter email|please enter password/i)

    // Makes sure no error messages exists
    expect(errorEls.length).toBe(0)

})