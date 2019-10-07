import React from 'react';
import {
    Route,
    Redirect,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';


class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            session: cookies.get('session') || false,
        };
    }

    componentDidMount() {
        console.log('auth props MOUNT', this.props);
        console.log('auth state MOUNT', this.state);
        if (!this.state.session) {
            console.log('not session');
            const { cookies } = this.props;
            const session = cookies.get('session') ? cookies.get('session') : false;
            this.setState({
                session,
            });
        }
    }

    componentDidUpdate(prevProps) {
        console.log('auth update PREV', prevProps);
        console.log('auth update THIS', this.props);
        if (prevProps.location.pathname !== this.props.location.pathname) {
            if (!this.state.session) {
                const { cookies } = this.props;
                const session = cookies.get('session') ? cookies.get('session') : false;
                this.setState({
                    session,
                });
            }
        }
        if (prevProps.allCookies !== this.props.allCookies) {
            console.log('prev cookies change');
            const { cookies } = this.props;
            const session = cookies.get('session') ? cookies.get('session') : false;
            this.setState({
                session,
            });
        }
    }

    render() {
        console.log('auth props', this.props);
        console.log('auth state', this.state);
        const { component: Component, ...rest } = this.props;
        const currentLocation = this.props.location.pathname;
        if (this.props.path.includes('/admin')) {
            if (this.state.session && this.state.session.is_logged) {
                return (
                    <Route
                        {...rest}
                        render={(props) => {
                            return this.state.session.is_admin === true ? (
                                <Component {...props} />
                            ) :
                                (
                                    <Redirect to="/" />
                                );
                        }}
                    />
                );
            }
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: currentLocation,
                }}
                />
            );
        }
        return (
            <Route
                {...rest}
                render={(props) => {
                    return this.state.session && this.state.session.is_logged ? (
                        <Component {...props} />
                    )
                        : (
                            <Redirect to={{
                                pathname: '/login',
                                state: currentLocation,
                            }}
                            />
                        );
                }}
            />
        );
    }
}

PrivateRoute.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    location: PropTypes.object.isRequired,
    allCookies: PropTypes.object.isRequired,
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
};


const mapStateToProps = (state) => {
    return {
        checkSession: state.checkSession,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default withCookies(withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)));
