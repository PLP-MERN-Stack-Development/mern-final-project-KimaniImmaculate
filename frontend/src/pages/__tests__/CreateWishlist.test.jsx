// frontend/src/pages/__tests__/CreateWishlist.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CreateWishlist from '../CreateWishlist'
import { MemoryRouter } from 'react-router-dom'

// Mock useNavigate and localStorage
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Mock localStorage so the page doesn't redirect
const mockLocalStorage = {
  getItem: vi.fn(() => 'fake-token'),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('CreateWishlist Page', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.getItem.mockReturnValue('fake-token')
  })

  it('renders correctly with all elements', () => {
    render(
      <MemoryRouter>
        <CreateWishlist />
      </MemoryRouter>
    )

    // Title input
    expect(screen.getByPlaceholderText('e.g. My Birthday 2025, Wedding Registry')).toBeInTheDocument()

    // Gift inputs
    expect(screen.getByPlaceholderText('Gift name *')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Link (optional)')).toBeInTheDocument()

    // Buttons
    expect(screen.getByText('+ Add another gift')).toBeInTheDocument()
    expect(screen.getByText('Create Wishlist & Get Share Link')).toBeInTheDocument()
  })

  it('adds a new gift field when clicking "+ Add another gift"', () => {
    render(
      <MemoryRouter>
        <CreateWishlist />
      </MemoryRouter>
    )

    const addButton = screen.getByText('+ Add another gift')
    fireEvent.click(addButton)

    // Now there should be 2 gift name inputs
    const giftNameInputs = screen.getAllByPlaceholderText('Gift name *')
    expect(giftNameInputs).toHaveLength(2)

    // And 2 URL inputs
    const urlInputs = screen.getAllByPlaceholderText('Link (optional)')
    expect(urlInputs).toHaveLength(2)
  })

  it('removes a gift when clicking Remove (when more than 1)', () => {
    render(
      <MemoryRouter>
        <CreateWishlist />
      </MemoryRouter>
    )

    // Add one more gift first
    fireEvent.click(screen.getByText('+ Add another gift'))

    // Now click Remove on the second one
    const removeButtons = screen.getAllByText('Remove')
    fireEvent.click(removeButtons[1])

    // Should be back to 1
    expect(screen.getAllByPlaceholderText('Gift name *')).toHaveLength(1)
  })
})