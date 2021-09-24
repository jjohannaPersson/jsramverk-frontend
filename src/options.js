import React from "react";
// import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function Options({ save }) {
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
        </div>
    );
}

Options.propTypes = {
    save: PropTypes.func.isRequired,
};

export default Options;
