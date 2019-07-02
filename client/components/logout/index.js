import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import localforage from 'localforage';
import PropTypes from 'prop-types';

class Logout extends React.Component {
    componentDidMount() {
        const { cookies } = this.props;
        localforage.removeItem('bda_session');
        localforage.removeItem('last_active');
        cookies.remove('session');
        // eslint-disable-next-line no-restricted-globals
        location.assign('/logout');
    }

    render() {
        return null;
    }
}

Logout.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
};

export default withCookies(withRouter(Logout));
