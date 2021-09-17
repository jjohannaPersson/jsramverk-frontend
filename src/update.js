import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import Options from './options';

function Update() {
    const [documentName, setDocumentName] = useState('');
    const [documentHtml, setDocumentHtml] = useState('');
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            return;
        }

        const abortController = new AbortController();
        const signal = abortController.signal;

        fetch(`https://jsramverk-editor-jopn20.azurewebsites.net/update/${id}`, {
            method: 'GET',
            signal: signal,
        })
            .then(res => res.json())
            .then(res => {
                setDocumentName(res.name);
                setDocumentHtml(res.html);
            })
            .catch(e => console.log(e));

        return function cancel() {
            abortController.abort()
        };
    }, [id]);

    function getName(event) {
        setDocumentName(event.target.value);
    }

    return (
        <div>
        <h2>Titel</h2>
        <form>
            <input aria-label="cost-input" type="text" value={documentName} onChange={getName} />
        </form>
        <ReactQuill theme="snow" value={documentHtml || ''} onChange={setDocumentHtml}/>
        <Options name={documentName} html={documentHtml} />
        </div>
);
}

Update.propTypes = {
    documentName: PropTypes.string,
    documentHtml: PropTypes.string,
};

export default Update;
