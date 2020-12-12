import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders convert button', () => {
  render(<App />);
  const btn = screen.getByRole('button');
  expect(btn).toHaveTextContent('変換');
});
