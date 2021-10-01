import React, { useState } from "react";
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import './App.css';
import GetAll from './getAll.js';
import Update from './update.js';
import Header from './header.js';
import Login from './login.js';
import Register from './register.js';

function App() {
    const [token, setToken] = useState();
    const [userEmail, setuserEmail] = useState();
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setToken(undefined);
        setuserEmail(undefined);
    };

    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');

    if (!token && savedToken) {
        setToken(savedToken);
        setuserEmail(savedEmail);
    }

    return (
        <div>
            <Router>
                <Header token={token} logout={logout}/>
                <Switch>
                    {token ?
                        <>
                            <Route exact path="/">
                                <GetAll token={token} />
                            </Route>
                            <Route exact path="/update/:id">
                                <Update token={token} userEmail={userEmail} />
                            </Route>
                            <Route exact path="/create">
                                <Update token={token} />
                            </Route>
                        </>
                        :
                        <>
                            <Route exact path="/">
                                <Login setToken={setToken} setuserEmail={setuserEmail} />
                            </Route>
                            <Route exact path="/signup">
                                <Register />
                            </Route>
                        </>
                    }
                </Switch>
            </Router>
        </div>
    );
}

export default App;
