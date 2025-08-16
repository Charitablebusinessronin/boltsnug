import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'
import { catalyst } from '../../lib/catalyst'

// Mock the catalyst service
vi.mock('../../lib/catalyst', () => ({
  catalyst: {
    initialize: vi.fn(),
    getCurrentUser: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    mapCatalystRoleToAppRole: vi.fn(),
  },
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle successful initialization with existing user', async () => {
    const mockUser = {
      user_id: '123',
      email_id: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      user_role_details: { role_name: 'Client' },
    }

    vi.mocked(catalyst.initialize).mockResolvedValue()
    vi.mocked(catalyst.getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(catalyst.mapCatalystRoleToAppRole).mockReturnValue('client')

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({
      id: '123',
      email: 'test@example.com',
      name: 'John Doe',
      role: 'client',
      avatar: undefined,
      lastLogin: expect.any(String),
    })
  })

  it('should handle initialization without existing user', async () => {
    vi.mocked(catalyst.initialize).mockResolvedValue()
    vi.mocked(catalyst.getCurrentUser).mockResolvedValue(null)

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle initialization error', async () => {
    vi.mocked(catalyst.initialize).mockRejectedValue(new Error('Init failed'))

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle successful sign in', async () => {
    const mockUser = {
      user_id: '123',
      email_id: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      user_role_details: { role_name: 'Client' },
    }

    vi.mocked(catalyst.initialize).mockResolvedValue()
    vi.mocked(catalyst.getCurrentUser).mockResolvedValue(null)
    vi.mocked(catalyst.signIn).mockResolvedValue(mockUser)
    vi.mocked(catalyst.mapCatalystRoleToAppRole).mockReturnValue('client')

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let signInResult: { success: boolean; error?: string }

    await act(async () => {
      signInResult = await result.current.signIn('test@example.com', 'password')
    })

    expect(signInResult!.success).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual({
      id: '123',
      email: 'test@example.com',
      name: 'John Doe',
      role: 'client',
      avatar: undefined,
      lastLogin: expect.any(String),
    })

    // Verify localStorage was called
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'snugs-user',
      expect.stringContaining('test@example.com')
    )
  })

  it('should handle sign in failure', async () => {
    vi.mocked(catalyst.initialize).mockResolvedValue()
    vi.mocked(catalyst.getCurrentUser).mockResolvedValue(null)
    vi.mocked(catalyst.signIn).mockRejectedValue(new Error('Invalid credentials'))

    const { result } = renderHook(() => useAuth())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let signInResult: { success: boolean; error?: string }

    await act(async () => {
      signInResult = await result.current.signIn('test@example.com', 'wrongpassword')
    })

    expect(signInResult!.success).toBe(false)
    expect(signInResult!.error).toContain('Invalid credentials')
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle successful sign out', async () => {
    const mockUser = {
      user_id: '123',
      email_id: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      user_role_details: { role_name: 'Client' },
    }

    vi.mocked(catalyst.initialize).mockResolvedValue()
    vi.mocked(catalyst.getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(catalyst.mapCatalystRoleToAppRole).mockReturnValue('client')
    vi.mocked(catalyst.signOut).mockResolvedValue()

    const { result } = renderHook(() => useAuth())

    // Wait for initial auth check
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    // Sign out
    await act(async () => {
      await result.current.signOut()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(catalyst.signOut).toHaveBeenCalled()
    expect(localStorage.removeItem).toHaveBeenCalledWith('snugs-user')
  })

  it('should handle sign out error gracefully', async () => {
    const mockUser = {
      user_id: '123',
      email_id: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      user_role_details: { role_name: 'Client' },
    }

    vi.mocked(catalyst.initialize).mockResolvedValue()
    vi.mocked(catalyst.getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(catalyst.mapCatalystRoleToAppRole).mockReturnValue('client')
    vi.mocked(catalyst.signOut).mockRejectedValue(new Error('Signout failed'))

    const { result } = renderHook(() => useAuth())

    // Wait for initial auth check
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
    })

    // Sign out should still work even if catalyst.signOut fails
    await act(async () => {
      await result.current.signOut()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(localStorage.removeItem).toHaveBeenCalledWith('snugs-user')
  })

  it('should map different role types correctly', async () => {
    const testCases = [
      { catalystRole: 'Admin', expectedRole: 'admin' },
      { catalystRole: 'Contractor', expectedRole: 'contractor' },
      { catalystRole: 'Employee', expectedRole: 'employee' },
      { catalystRole: 'Client', expectedRole: 'client' },
    ]

    for (const { catalystRole, expectedRole } of testCases) {
      vi.clearAllMocks()
      
      const mockUser = {
        user_id: '123',
        email_id: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        user_role_details: { role_name: catalystRole },
      }

      vi.mocked(catalyst.initialize).mockResolvedValue()
      vi.mocked(catalyst.getCurrentUser).mockResolvedValue(mockUser)
      vi.mocked(catalyst.mapCatalystRoleToAppRole).mockReturnValue(expectedRole as 'client' | 'contractor' | 'admin' | 'employee')

      const { result } = renderHook(() => useAuth())

      await waitFor(() => {
        expect(result.current.user?.role).toBe(expectedRole)
      })
    }
  })
})