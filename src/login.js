import React, { useState } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const ENDPOINT = "https://jsramverk-editor-jopn20.azurewebsites.net";

function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const goSubmit = (e) => {
        e.preventDefault();

        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`${ENDPOINT}/login`, {
            method: "POST",
            signal: signal,
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then( res => {
                setToken(res.data.token);
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('email', res.data.user.email);
            })
            .catch(e => console.log(e));

        return function cancel() {
            controller.abort();
        };
    };

    return (
        <div className="form">
            <form onSubmit={goSubmit}>
                <h3>
                    <span>Logga in eller </span>
                    <Link to={'/signup'}>
                        <span>registrera dig! </span>
                    </Link>
                </h3>
                <div>
                    <label htmlFor="email">
                        Email:
                    </label>
                    <input className="input" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email" type ="email" />
                </div>
                <div>
                    <label htmlFor="password">
                        Lösenord:
                    </label>
                    <input className="input" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password" type ="password" />
                </div>
                <input
                    type="submit"
                    value="Logga in"
                    className="submitButton"
                />
            </form>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};

export default Login;
