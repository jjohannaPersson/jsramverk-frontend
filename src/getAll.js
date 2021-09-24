import React, { useEffect, useState } from "react";
// import ReactQuill from 'react-quill';
import { Link } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import './App.css';
import OneDoc from "./getOne";

function GetAll() {
    const [documentInfo, setDocumentInfo] = useState([]);

    console.log("Rendering");

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetch('https://jsramverk-editor-jopn20.azurewebsites.net/', {
            method: 'GET',
            signal: signal,
        })
            .then(res => res.json())
            .then(res => setDocumentInfo(res))
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

export default GetAll;
