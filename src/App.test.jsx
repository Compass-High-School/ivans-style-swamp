import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Just a simple check to ensure it mounts
    expect(document.body).toBeDefined();
  });
});
