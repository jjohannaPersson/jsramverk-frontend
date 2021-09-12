import React from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

function OneDoc({ document }) {
    return (
        <li>
            <Link to={`/update/${document._id}`}>
                {document.name}
            </Link>
        </li>
    );
}

OneDoc.propTypes = {
    document: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
};

export default OneDoc;
