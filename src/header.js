import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types';

function Header({ token, logout }) {
    const history = useHistory();

    const goLogout = () => {
        logout();
        history.push(`/`);
    };

    return (
        <div className="header">
            <div></div>
            <h1>JSramverk</h1>
            {token
                ?
                <button onClick={goLogout}>
                    Logga ut
                </button>
                :
                <div></div>
            }
        </div>
    );
}

Header.propTypes = {
    token: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
};

export default Header;
