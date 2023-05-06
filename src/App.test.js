import { render, screen } from '@testing-library/react';
import App from './App';

test('renders clear button', () => {
  render(<App />);
  const linkElement = screen.getByText(/AC/i);
  expect(linkElement).toBeInTheDocument();
});
