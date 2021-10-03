import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Renders the headline JSramverk', () => {
    const { container } = render(<App />);

    expect(screen.getByText('JSramverk')).toBeInTheDocument();
});

test('If the link "registrera dig!" renders form', () => {
    const { container } = render(<App />);

    const button = screen.getByText('registrera dig!');

    fireEvent.click(button);
    expect(screen.getByText('Registrera')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Lösenord:')).toBeInTheDocument();
});

test('If email is empty when signing up', () => {
    const container = render(<App />);
    const input = container.getByLabelText('e-input');

    expect(input.value).toBe("");
});
