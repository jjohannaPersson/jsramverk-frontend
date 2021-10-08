import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";

const ENDPOINT = "https://jsramverk-editor-jopn20.azurewebsites.net";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const goSubmit = (e) => {
        e.preventDefault();

        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`${ENDPOINT}/signup`, {
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
            .then((res) => {
                if (res.errors) {
                    alert(res.errors[0].detail);
                    return;
                }
                history.push("/");
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
                    <span>Registrera dig eller </span>
                    <Link to={'/'}>
                        <span>logga in </span>
                    </Link>
                </h3>
                <div>
                    <label htmlFor="email">
                        Email:
                    </label>
                    <input aria-label="e-input" className="input" value={email}
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
                    value="Registrera"
                    className="submitButton"
                />
            </form>
        </div>
    );
}

export default Register;
