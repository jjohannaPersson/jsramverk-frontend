import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { render, screen, fireEvent } from '@testing-library/react';
import { HashRouter, Route } from 'react-router-dom';
import App from './App';
import Update from './update';

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test page', route);

    return render(ui, { wrapper: HashRouter });
};

const ENDPOINT = "https://jsramverk-editor-jopn20.azurewebsites.net";

const httpLink = createHttpLink({
    uri: `${ENDPOINT}/graphql`,
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    };
});

const client = new ApolloClient({
    uri: 'http://localhost:1337',
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

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

test('Creating pdf works', () => {
    global.localStorage = {
        store: {},
        getItem: (key)=>this.store[key],
        setItem: (key, value)=> this.store[key] = value
    };
    global.localStorage.setItem("token", "mocked-token");

    renderWithRouter(<ApolloProvider client={client}>
        <App />
    </ApolloProvider>, { route: '/#/update/6157195f1c2c039adf161967' });

    expect(screen.getByText('Skapa PDF')).toBeInTheDocument();

    const button = screen.getByTestId("pdf");

    const fire = fireEvent.click(button);

    expect(screen.getByText('Du har nu skapat en pdf!')).toBeInTheDocument();
});

test('Test sending e-mail', () => {
    global.localStorage = {
        store: {},
        getItem: (key)=>this.store[key],
        setItem: (key, value)=> this.store[key] = value
    };
    global.localStorage.setItem("token", "mocked-token");

    renderWithRouter(<ApolloProvider client={client}>
        <App />
    </ApolloProvider>, { route: '/#/update/6157195f1c2c039adf161967' });

    expect(screen.getByText('Bjud in en användare:')).toBeInTheDocument();

    const button = screen.getByText('Skicka inbjudan');

    const fire = fireEvent.click(button);

    expect(screen.getByText('Du har nu skickat en inbjudan!')).toBeInTheDocument();
});
