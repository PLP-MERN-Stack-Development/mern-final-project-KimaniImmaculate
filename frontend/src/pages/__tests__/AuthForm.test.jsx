// frontend/src/pages/__tests__/AuthForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuthForm from '../AuthForm'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'

vi.mock('axios')
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => vi.fn() }
})

describe('AuthForm Page', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders login form by default', () => {
    render(<MemoryRouter><AuthForm /></MemoryRouter>)

    expect(screen.getByText('Welcome Back!')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument() // ← This was wrong before!
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Your Name')).not.toBeInTheDocument()
  })

  it('switches to register form when clicking "Sign Up"', () => {
    render(<MemoryRouter><AuthForm /></MemoryRouter>)
    fireEvent.click(screen.getByText('Sign Up'))

    expect(screen.getByText('Join Zawify')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument()
  })

  it('shows error message on failed login', async () => {
    axios.post.mockRejectedValue({ response: { data: { msg: 'Invalid credentials' } } })

    render(<MemoryRouter><AuthForm /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument())
  })

  it('successfully logs in and saves token', async () => {
    axios.post.mockResolvedValue({ data: { token: 'fake-token' } })
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')

    render(<MemoryRouter><AuthForm /></MemoryRouter>)

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123456' } })
    fireEvent.click(screen.getByRole('button', { name: 'Log In' }))

    await waitFor(() => expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-token'))
  })
})