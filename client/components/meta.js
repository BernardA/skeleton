import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';


class Meta extends React.Component {
    render() {
        const { location } = this.props;
        const path = location.pathname;
        switch (path) {
        case path.match('/'):
            return (
                <Helmet>
                    <title>home page</title>
                    <meta
                        name="description"
                        content="Services and objects."
                    />
                </Helmet>
            );
        case path.match(/\/account.*/):
            return (
                <Helmet>
                    <title>account page</title>
                    <meta
                        name="description"
                        content="accounts"
                    />
                </Helmet>
            );
        case path.match(/\/admin.*/):
            return (
                <Helmet>
                    <title>admin page</title>
                    <meta name="description" content="admin" />
                </Helmet>
            );
        case path.match(/\/resetting.*/):
            return (
                <Helmet>
                    <title>password reset page</title>
                    <meta name="description" content="reset password." />
                </Helmet>
            );
        case path.match(/\/registration/):
            return (
                <Helmet>
                    <title>registration page</title>
                    <meta name="description" content="registration " />
                </Helmet>
            );
        case path.match(/\/registration-social/):
            return (
                <Helmet>
                    <title>registration social page</title>
                    <meta name="description" content="registration social." />
                </Helmet>
            );
        case path.match(/\/registration-result.*/):
            return (
                <Helmet>
                    <title>registration result page</title>
                    <meta name="description" content="registration result." />
                </Helmet>
            );
        case path.match(/\/login.*/):
            return (
                <Helmet>
                    <title>login page</title>
                    <meta name="description" content="login" />
                </Helmet>
            );
        default:
            return null;
        }
    }
}

Meta.propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(Meta);
