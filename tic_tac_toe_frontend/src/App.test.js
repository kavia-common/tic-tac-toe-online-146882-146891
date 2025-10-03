import { render, screen } from '@testing-library/react';
import App from './App';

test('renders status area', () => {
  render(<App />);
  const status = screen.getByRole('status');
  expect(status).toBeInTheDocument();
});
