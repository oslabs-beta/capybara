// >> APP TEST << //
import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

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
});

describe('App Component', () => {
  it('Renders the Toggle Theme button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });
});

describe('App Component', () => {
  it('Renders  TestComponent', () => {
    render(<App />);
    const heading = screen.getByText(/Hello/i);
    expect(heading).toBeInTheDocument();
  });
});
