import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import './App.css';
import OneDoc from "./getOne";
import PropTypes from 'prop-types';

function GetAll({ token }) {
    const [documentInfo, setDocumentInfo] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetch('https://jsramverk-editor-jopn20.azurewebsites.net/graphql', {
            method: 'POST',
            signal: signal,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({ query: "{ documents { _id, name, html, allowed_users } }" })
        })
            .then(res => res.json())
            .then(data => setDocumentInfo(data.data.documents))
            .catch(e => console.log(e));

        return function cancel() {
            abortController.abort();
        };
    }, []);

    return (
        <div className="documentInfo">
            <h2>Välj ett dokument nedan för att läsa eller uppdatera</h2>
            <ul>
                {documentInfo.map((document, index) =>
                    <OneDoc key={index} document={document} />
                )}
            </ul>
            <Link to="/create">
                <button className="create">
                Skapa nytt dokument
                </button>
            </Link>
        </div>
    );
}

GetAll.propTypes = {
    token: PropTypes.string.isRequired,
};

export default GetAll;
