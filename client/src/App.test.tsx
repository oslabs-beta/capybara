// >> APP TEST << //
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('Renders  TestComponent', () => {
    render(<App />);
    const heading = screen.getByText(/Hello/i);
    expect(heading).toBeInTheDocument();
  });
});
