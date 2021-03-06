import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import 'react-quill/dist/quill.snow.css';
import './App.css';
import Options from './options';
import io from 'socket.io-client';
import { pdfExporter } from 'quill-to-pdf';
import { saveAs } from 'file-saver';

const ENDPOINT = "https://jsramverk-editor-jopn20.azurewebsites.net";

function Update({ token, userEmail }) {
    const [documentName, setDocumentName] = useState('');
    const [documentHtml, setDocumentHtml] = useState('');
    const [documentUsers, setDocumentUsers] = useState([]);
    const [lastData, setLastData] = useState({});
    const [popup, showPopup] = useState(false);
    const [popupText, setPopupText] = useState("");
    const socketRef = useRef();
    const quill = useRef(null);

    useEffect(() => {
        const socket = io.connect(ENDPOINT);

        socketRef.current = socket;

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, []);

    const { id } = useParams();

    const handleChange = (html, data) => {
        if (!documentHtml) {
            return;
        }

        setDocumentHtml(html);

        if (JSON.stringify(lastData.ops) === JSON.stringify(data.ops)) {
            return;
        }

        setLastData(data);

        socketRef.current.emit("doc", data);
    };

    useEffect(() => {
        if (!id) {
            return;
        }

        const abortController = new AbortController();
        const signal = abortController.signal;

        fetch(`${ENDPOINT}/update/${id}`, {
            method: 'GET',
            signal: signal,
            headers: {
                "Authorization": `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                setDocumentName(res.name);
                setDocumentHtml(res.html);
                setDocumentUsers(res.allowed_users);
            })
            .catch(e => console.log(e));

        socketRef.current.emit("create", id);

        socketRef.current.on("doc", function (data) {
            setLastData(data);
            quill.current.getEditor().updateContents(data);
        });

        return function cancel() {
            abortController.abort();
            socketRef.current.off('doc');
        };
    }, [id]);

    function getName(event) {
        setDocumentName(event.target.value);
    }

    function saveDoc() {
        if (id) {
            if (documentUsers.includes(userEmail)) {
                updateDoc();
                return;
            } else {
                alert("Du har inte till??telse att redigera detta dokument!");
            }
        } else {
            createDoc();
        }
    }

    function updateDoc() {
        const newHtml = quill.current.getEditor().editor.delta.ops[0].insert;
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`${ENDPOINT}/update/${id}`, {
            method: 'PUT',
            signal: signal,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                name: documentName,
                html: newHtml
            })
        })
            .then(data => {console.log(data);})
            .catch(e => console.log(e));

        return function cancel() {
            controller.abort();
        };
    }

    function createDoc() {
        const newHtml = quill.current.getEditor().editor.delta.ops[0].insert;
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`${ENDPOINT}/create`, {
            method: "POST",
            signal: signal,
            body: JSON.stringify({
                name: documentName,
                html: newHtml,
                allowed_users: []
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                "Authorization": `Token ${token}`
            }
        })
            .catch(e => console.log(e));

        return function cancel() {
            controller.abort();
        };
    }

    function getAccess() {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`${ENDPOINT}/update/${id}`, {
            method: 'PUT',
            signal: signal,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                allowed_users: userEmail
            })
        })
            .then(data => {
                console.log(data);
                setDocumentUsers(userEmail);
                showPopup(true);
                setPopupText("Nu kan du redigera i dokumentet!");
                // alert("Nu kan du redigera i dokumentet!");
            })
            .catch(e => console.log(e));

        return function cancel() {
            controller.abort();
        };
    }

    async function exportPdf() {
        showPopup(true);
        setPopupText("Du har nu skapat en pdf!");
        const delta = quill.current.getEditor().editor.delta;  // gets the Quill delta
        const pdfAsBlob = await pdfExporter.generatePdf(delta); // converts to PDF

        saveAs(pdfAsBlob, `${documentName}.pdf`); // downloads from the browser
    }

    function sendMail(mail) {
        const controller = new AbortController();
        const signal = controller.signal;

        console.log(`Frontend skickar mejl till: ${mail}`);

        fetch(`${ENDPOINT}/mail/send/${mail}`, {
            method: 'GET',
            signal: signal,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => {
                res.json();
            })
            .catch(e => console.log(e));

        showPopup(true);
        setPopupText("Du har nu skickat en inbjudan!");

        return function cancel() {
            controller.abort();
        };
    }


    return (
        <div>
            <h2>Titel</h2>
            <form>
                <input aria-label="cost-input" type="text"
                    value={documentName} onChange={getName} />
            </form>
            <ReactQuill ref={quill} theme="snow" value={documentHtml || ''}
                onChange={handleChange}/>
            <Options save={saveDoc} getAccess={getAccess} pdf={exportPdf}
                sendMail={sendMail}/>
            <div
                className={
                    popup ? "block" : "hidden"
                }
                onClick={() => showPopup(false)}
            >
                <div className="block-content">
                    <span className="close">&times;</span>
                    <p>{popupText}</p>
                </div>
            </div>
        </div>
    );
}

Update.propTypes = {
    token: PropTypes.string.isRequired,
};

export default Update;
