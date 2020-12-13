import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './';

test('renders h1', () => {
  render(<App />);
  const h1 = screen.getByText('Antipie');
  expect(h1).toBeInTheDocument();
});
