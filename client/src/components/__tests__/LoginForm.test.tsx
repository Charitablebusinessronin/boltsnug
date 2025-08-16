import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginForm } from '../LoginForm'
import { useAuth } from '../../hooks/useAuth'

// Mock the useAuth hook
vi.mock('../../hooks/useAuth')

const mockUseAuth = vi.mocked(useAuth)

describe('LoginForm Component', () => {
  const mockSignIn = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: mockSignIn,
      signOut: vi.fn(),
    })
  })

  it('renders the login form correctly', () => {
    render(<LoginForm />)

    expect(screen.getByText('SNUGS & KISSES')).toBeInTheDocument()
    expect(screen.getByText('Compassionate Care Portal')).toBeInTheDocument()
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to access your dashboard')).toBeInTheDocument()
    
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays demo credentials information', () => {
    render(<LoginForm />)

    expect(screen.getByText('Test Credentials (Development):')).toBeInTheDocument()
    expect(screen.getByText('client@example.com')).toBeInTheDocument()
    expect(screen.getByText('contractor@example.com')).toBeInTheDocument()
    expect(screen.getByText('admin@example.com')).toBeInTheDocument()
    expect(screen.getByText('employee@example.com')).toBeInTheDocument()
    expect(screen.getByText('password123')).toBeInTheDocument()
  })

  it('handles form input correctly', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: '' }) // Eye icon button

    // Initially password should be hidden
    expect(passwordInput.type).toBe('password')

    // Click to show password
    await user.click(toggleButton)
    expect(passwordInput.type).toBe('text')

    // Click again to hide password
    await user.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  it('handles successful form submission', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ success: true })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('handles form submission failure', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ 
      success: false, 
      error: 'Invalid email or password. Please try again.' 
    })

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    const user = userEvent.setup()
    
    // Create a promise that we can control
    let resolveSignIn: (value: { success: boolean }) => void
    const signInPromise = new Promise((resolve) => {
      resolveSignIn = resolve
    })
    
    mockSignIn.mockReturnValue(signInPromise)

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // Start form submission
    await user.click(submitButton)

    // Check loading state
    expect(screen.getByText('Signing In...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()

    // Resolve the promise
    resolveSignIn({ success: true })

    await waitFor(() => {
      expect(screen.queryByText('Signing In...')).not.toBeInTheDocument()
    })
  })

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValue(new Error('Network error'))

    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Try to submit without filling fields
    await user.click(submitButton)

    // HTML5 validation should prevent submission
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email')

    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password')

    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('displays brand colors and healthcare theme', () => {
    render(<LoginForm />)

    // Check for healthcare-specific CSS classes
    const welcomeSection = screen.getByText('Welcome Back').closest('div')
    const form = screen.getByRole('form')?.closest('div')

    // These classes should be present based on our healthcare design system
    expect(welcomeSection?.parentElement).toHaveClass('bg-white/90')
    expect(form?.parentElement).toHaveClass('rounded-2xl')
  })

  it('shows forgot password link', () => {
    render(<LoginForm />)
    
    const forgotPasswordLink = screen.getByText('Forgot your password?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '#')
  })
})