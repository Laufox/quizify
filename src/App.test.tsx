import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import userEvent from '@testing-library/user-event'
import SearchFrom from './components/SearchForm'
import "@testing-library/jest-dom/extend-expect"
import AuthContextProvider from './contexts/AuthContext'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const myFunction = () => {}

test('renders search form and types', async () => {

    render(<SearchFrom onSearch={myFunction} />)

    const inputElement = screen.getByRole('search')

    expect(inputElement).toBeInTheDocument()
    expect(inputElement.value).toBe('')

    await userEvent.type(inputElement, 'test')

    expect(inputElement.value).toBe('test')

})

test('renders app in authcontextprovider', () => {

    render(<BrowserRouter><AuthContextProvider><App /></AuthContextProvider></BrowserRouter>)

    const heading = screen.getAllByText(/quizify/gi)

    expect(heading.length).toBe(2)

})