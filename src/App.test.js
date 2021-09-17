import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Renders the headline JSramverk', () => {
    const { container } = render(<App />);

    expect(screen.getByText('JSramverk')).toBeInTheDocument();
});

test('If the button "Skapa nytt dokument" renders editor', () => {
    const { container } = render(<App />);

    const button = screen.getByText('Skapa nytt dokument');

    fireEvent.click(button);
    expect(screen.getByText('Titel')).toBeInTheDocument();
    expect(screen.getByText('Spara')).toBeInTheDocument();
    expect(screen.getByText('Tillbaka')).toBeInTheDocument();
});

test('If title is empty when creating a new document', () => {
    const container = render(<App />);
    const input = container.getByLabelText('cost-input');

    expect(input.value).toBe("");
});
