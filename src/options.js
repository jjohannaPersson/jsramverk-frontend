import React, { useState } from "react";
// import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function Options({ save, getAccess, pdf, sendMail }) {
    const [invited, setinvited] = useState('');

    return (
        <div className="Options">
            <button
                onClick={save}
            >Spara
            </button>
            <Link to={`/`}>
                <button>
					Tillbaka
                </button>
            </Link>
            <button
                onClick={getAccess}
            >Få tillstånd att redigera i dokumentet
            </button>

            <button
                onClick={pdf}
                data-testid="pdf"
            >Skapa PDF
            </button>

            <div className="sendgrid">
                <h2>Bjud in en användare:</h2>
                <input type="email" placeholder="Email" value={invited}
                    onChange={(event) => setinvited(event?.target.value)} />
                <button
                    onClick={() => sendMail(invited)}
                >Skicka inbjudan
                </button>
            </div>
        </div>
    );
}

Options.propTypes = {
    save: PropTypes.func.isRequired,
};

export default Options;
