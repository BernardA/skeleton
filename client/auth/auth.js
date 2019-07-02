import React from 'react';
import {
    Route,
    Redirect,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
import { withCookies, Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import { actionCheckSession } from '../store/actions';

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
            this.checkIsLogged();
        }
    }

    componentDidUpdate(prevProps) {
        console.log('auth update PREV', prevProps);
        console.log('auth update THIS', this.props);
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.checkIsLogged();
        }
        if (prevProps.allCookies !== this.props.allCookies) {
            console.log('prev cookies change');
            const { cookies } = this.props;
            const session = cookies.get('session');
            if (session) {
                this.setState({
                    session,
                });
            }
        }
    }

    checkIsLogged = () => {
        // check if session exists
        // if so allows user in but proceeds to check session on remote
        if (!this.state.session) {
            console.log('not session');
            const { cookies } = this.props;
            const session = cookies.get('session');
            if (session) {
                this.setState({
                    session,
                });
            }
        }
        const check = new Promise((resolve) => {
            let lastActiveClient = 0;
            localforage.getItem('last_active').then((value) => {
                if (value) {
                    lastActiveClient = value;
                }
                resolve(this.props.actionCheckSession(lastActiveClient));
            });
        });
        check.then((response) => {
            console.log('response', response);
            if (response.error) {
                // check if offline event already fired and fires otherwise
                localforage.getItem('offline-event-fired').then((data) => {
                    if (data === null) {
                        window.dispatchEvent(new Event('offline'));
                        localforage.setItem('offline-event-fired', true);
                    }
                });
            } else {
                console.log('response check is logged', response);
                // SET COOKIES
                const { cookies } = this.props;
                cookies.set('session', response.payload.data, { path: '/' });
            }
        }).catch((error) => {
            console.log('error', error);
        });
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
    actionCheckSession: PropTypes.func.isRequired,
    component: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
};


const mapStateToProps = (state) => {
    return {
        checkSession: state.checkSession,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ actionCheckSession }, dispatch);
}

export default withCookies(withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)));
