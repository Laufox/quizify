// Imports needed to perform the test itself
import { render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { test, expect } from "vitest";
import userEvent from '@testing-library/user-event'

// Components import to be able to render the main component during tests
import { BrowserRouter } from "react-router-dom";
import CreateAccountPage from "../CreateAccountPage";
import AuthContextProvider from '../../contexts/AuthContext'

test('Renders sign up form', async () => {

    // Making sure the create account component renders/loads
    await act(async () => {
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <CreateAccountPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const headingEl = screen.getByText(/create your account/i)
    const emailInputEl = screen.getByLabelText(/^email/i)
    const passwordInputEl = screen.getByLabelText(/^password/i)
    const passwordRepeatInputEl = screen.getByLabelText(/^repeat password/i)
    const usernameInputEl = screen.getByLabelText(/^username/i)
    const submitButton = screen.getByRole('button')

    // Testing to see that all elements exist on the page
    expect(headingEl).toBeInTheDocument()
    expect(emailInputEl).toBeInTheDocument()
    expect(passwordInputEl).toBeInTheDocument()
    expect(passwordRepeatInputEl).toBeInTheDocument()
    expect(usernameInputEl).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

})

test('Getting error feedback when typing invalid data', async () => {
    
    // Making sure the create account component renders/loads
    await act(async () => {
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <CreateAccountPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })

    // Finds various elements on the page and saves them to variables
    const emailInputEl :HTMLInputElement = screen.getByLabelText(/^email/i)
    const passwordInputEl :HTMLInputElement = screen.getByLabelText(/^password/i)
    const passwordRepeatInputEl :HTMLInputElement = screen.getByLabelText(/^repeat password/i)
    const submitButton :HTMLInputElement = screen.getByRole('button')

    // Type invalid data
    await userEvent.type(emailInputEl, 'bad-email.se')
    await userEvent.type(passwordInputEl, '123')
    await userEvent.type(passwordRepeatInputEl, 'abc')
    await userEvent.click(submitButton)

    // Making sure error text is displayed
    expect(screen.getByText(/incorrect email format/i)).toBeInTheDocument()
    expect(screen.getByText(/password must be at least six characters/i)).toBeInTheDocument()
    expect(screen.getByText(/password does not match/i)).toBeInTheDocument()
    expect(screen.getByText(/username is required/i)).toBeInTheDocument()

})

test('Filling in and submitting the form', async () => {

    // Making sure the create account component renders/loads
    await act(async () => {
        render(
            <BrowserRouter>
                <AuthContextProvider>
                    <CreateAccountPage />
                </AuthContextProvider>
            </BrowserRouter>
        )
    })
    
    // Finds various elements on the page and saves them to variables
    const emailInputEl :HTMLInputElement = screen.getByLabelText(/^email/i)
    const passwordInputEl :HTMLInputElement = screen.getByLabelText(/^password/i)
    const passwordRepeatInputEl :HTMLInputElement = screen.getByLabelText(/^repeat password/i)
    const usernameInputEl :HTMLInputElement = screen.getByLabelText(/^username/i)
    const submitButton :HTMLButtonElement = screen.getByRole('button')

    // Making sure input fields are typeable
    await userEvent.type(emailInputEl, 'mail@mail.com')
    await userEvent.type(passwordInputEl, 'abc123')
    await userEvent.type(passwordRepeatInputEl, 'abc123')
    await userEvent.type(usernameInputEl, 'useruser')
    
    // Making sure input fields have right value
    expect(emailInputEl.value).toBe('mail@mail.com')
    expect(passwordInputEl.value).toBe('abc123')
    expect(passwordRepeatInputEl.value).toBe('abc123')
    expect(usernameInputEl.value).toBe('useruser')
    
    // Making sure submit button can be clicked
    await userEvent.click(submitButton)

    // Array for elements with eror messages
    const errorEls = screen.queryAllByText(/please enter email|incorrect email format|please enter password|password must be at least six characters|please repeat password|password does not match|username is required/i)

    // Makes sure no error messages exists
    expect(errorEls.length).toBe(0)

})