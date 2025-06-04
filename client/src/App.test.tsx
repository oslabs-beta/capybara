// >> APP TEST << //
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock Clerk components and hooks
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
    isLoaded: true,
    isSignedIn: true,
  }),
  useClerk: () => ({
    signOut: vi.fn(),
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div style={{ display: 'none' }}>{children}</div>,
  UserButton: () => <button>User Menu</button>,
  SignInButton: () => <button>Sign In</button>,
  SignUpButton: () => <button>Sign Up</button>,
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock React Router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {
      // do nothing
    }
    unobserve() {
      // do nothing
    }
    disconnect() {
      // do nothing
    }
  };

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });

  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => null),
      removeItem: vi.fn(() => null),
      clear: vi.fn(() => null),
    },
    writable: true,
  });
});

describe('App Component', () => {
  it('Renders the theme toggle element', () => {
    render(<App />);
    // The theme toggle is rendered as a checkbox with "Light Mode" label
    const themeToggle = screen.getByRole('checkbox', { name: /light mode/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('Renders the app without errors', () => {
    render(<App />);
    // Just check that the app renders without throwing errors
    // and contains some expected elements like the header
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
