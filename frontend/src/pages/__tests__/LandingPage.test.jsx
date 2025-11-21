// frontend/src/pages/__tests__/LandingPage.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LandingPage from '../LandingPage'
import { MemoryRouter } from 'react-router-dom'

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => vi.fn() }
})

describe('LandingPage', () => {
  it('renders hero section with main heading and CTAs', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)

    expect(screen.getByText('Zawify')).toBeInTheDocument()
    expect(screen.getByText('thoughtful moments')).toBeInTheDocument() // ← just check part of it
    expect(screen.getByText(/no more duplicate presents/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Log In / Sign Up' })).toBeInTheDocument()
  })

  it('shows all three feature cards', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)
    expect(screen.getByText('How Zawify Works')).toBeInTheDocument()
    expect(screen.getByText('Create a Wishlist')).toBeInTheDocument()
    expect(screen.getByText('Share and Claim')).toBeInTheDocument()
    expect(screen.getByText('Real-Time Updates')).toBeInTheDocument()
  })

  it('has a secondary CTA button at the bottom', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)
    expect(screen.getByRole('button', { name: 'Create Your First Wishlist Today' })).toBeInTheDocument()
  })

  it('shows footer with current year', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)
    const year = new Date().getFullYear()
    expect(screen.getByText(`© ${year} Zawify. All rights reserved.`)).toBeInTheDocument()
  })
})