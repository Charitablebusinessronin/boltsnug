import '@testing-library/jest-dom'

// Mock window.catalyst for testing
Object.defineProperty(window, 'catalyst', {
  value: {
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      getCurrentUser: vi.fn(),
    },
    initialize: vi.fn(),
    function: {
      execute: vi.fn(),
    },
  },
  writable: true,
})

// Mock environment variables for testing
vi.mock('import.meta.env', () => ({
  VITE_CATALYST_PROJECT_ID: 'test-project-id',
  VITE_ENVIRONMENT: 'test',
  VITE_CATALYST_APP_URL: 'https://test.catalystserverless.com',
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})