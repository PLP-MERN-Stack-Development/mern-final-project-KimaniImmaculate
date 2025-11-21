// frontend/src/pages/__tests__/WishlistDetail.test.jsx
import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import WishlistDetail from '../WishlistDetail'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

vi.mock('axios', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}))

vi.mock('socket.io-client', () => {
  const mockSocket = {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  }
  return { default: () => mockSocket }
})

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useParams: () => ({ wishlistId: '123' }),
  }
})

describe('WishlistDetail Page', () => {
  const mockWishlist = {
    title: "Sarah's Birthday Wishlist",
    ownerName: 'Sarah',
    gifts: [
      { _id: 'gift1', name: 'AirPods Pro', url: 'https://apple.com', isClaimed: false },
      { _id: 'gift2', name: 'Kindle Paperwhite', url: '', isClaimed: true, claimedByName: 'John' }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: mockWishlist })
  })

  it('loads and displays wishlist with title and gifts', async () => {
    render(
      <MemoryRouter initialEntries={['/wishlist/123']}>
        <Routes>
          <Route path="/wishlist/:wishlistId" element={<WishlistDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText("Sarah's Birthday Wishlist")).toBeInTheDocument()
      expect(screen.getByText(/A list created by/i)).toBeInTheDocument()
      expect(screen.getByText('Sarah')).toBeInTheDocument()
      expect(screen.getByText('AirPods Pro')).toBeInTheDocument()
      expect(screen.getByText('Kindle Paperwhite')).toBeInTheDocument()
      expect(screen.getByText(/CLAIMED by John/i)).toBeInTheDocument()
    })
  })

  it('shows claim button for unclaimed gifts', async () => {
    render(
      <MemoryRouter initialEntries={['/wishlist/123']}>
        <Routes>
          <Route path="/wishlist/:wishlistId" element={<WishlistDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('AirPods Pro'))
    expect(screen.getByRole('button', { name: 'Claim This Gift' })).toBeInTheDocument()
  })

  it('handles real-time gift claim via socket', async () => {
    render(
      <MemoryRouter initialEntries={['/wishlist/123']}>
        <Routes>
          <Route path="/wishlist/:wishlistId" element={<WishlistDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => screen.getByText('AirPods Pro'))

    const socketModule = await import('socket.io-client')
    const onCallback = socketModule.default().on.mock.calls
      .find(call => call[0] === 'gift-claimed')[1]

    act(() => {
      onCallback({ giftId: 'gift1', claimedByName: 'Emma' })
    })

    await waitFor(() => {
      expect(screen.getByText(/CLAIMED by Emma/i)).toBeInTheDocument()
    })
  })

  it('shows error when wishlist not found', async () => {
    axios.get.mockRejectedValue(new Error('Not found'))

    render(
      <MemoryRouter initialEntries={['/wishlist/invalid']}>
        <Routes>
          <Route path="/wishlist/:wishlistId" element={<WishlistDetail />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Wishlist not found!')).toBeInTheDocument()
    })
  })
})