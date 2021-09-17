import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function Options({ name, html }) {
    const { id } = useParams();

    function saveDoc() {
        if (id) {
            updateDoc();
            return;
        }
        createDoc();
    }

    function updateDoc() {
        const controller = new AbortController();
        const signal = controller.signal;

        console.log(name);
        console.log(html);
        console.log(`${id}`);

        fetch(`https://jsramverk-editor-jopn20.azurewebsites.net/update/${id}`, {
            method: 'PUT',
            signal: signal,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: name,
                html: html
            })
        })
            .then(data => {console.log(data);})
            .catch(e => console.log(e));

        return function cancel() {
            controller.abort();
        };
    }

    function createDoc() {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`https://jsramverk-editor-jopn20.azurewebsites.net/create`, {
            method: "POST",
            signal: signal,
            body: JSON.stringify({
                name: name,
                html: html
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .catch(e => console.log(e));

        return function cancel() {
            controller.abort();
        };
    }

    return (
        <div className="Options">
            <button
                onClick={saveDoc}
            >Spara
            </button>
            <Link to={`/`}>
                <button>
					Tillbaka
                </button>
            </Link>
        </div>
    );
}

Options.propTypes = {
    name: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
};

export default Options;
