import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';
import {
    actionGetInitialDataForOffline,
    actionCheckSession,
} from '../../store/actions';
import { Now } from '../../tools/functions';
import NotifierDialog from '../notifier_dialog';

/* This is an attempt to succintly describe how this all works:
The aim of this and accompanying scripts is to control and handle idle sessions
The corresponding script on the server side is App/Controllers/ApiSessionController
A session variable (session.last_active) is created on InitializerListener
 and it is not updated on accessing ApiSessionController
1 - on login an initial checkInterval is set and on componentDidMount
 the getSessionLastActive is triggered
2 - the last active client info is sent to the server and compared to the last active server
3 - the most recent is updated on both sides
4 - if user has been logged out on the server side,
it will also immediately be disconnected client side
5 - comparing last active with MAX_IDLE_TIME the script
decides next time to check or if to show session idle warning
6 - if session idle warning is shown and user does
not explicitly extends the session, script will once again check the server
7 - if no more recent activity is detected, it will logout the user
8 - a flag will be created on memcached to indicate that user has been logged out due to inactivity
9 - when /logout redirects to homepage the script
will check on the server side if the session idle flag exists
10 - if so, it will show a message like" logged out due to inactivity"

*/
const MAX_IDLE_TIME_SERVER = 18000; // 5 hours
const MAX_IDLE_TIME = 3600; // 5+ hours = set to 10 hours or higher on server
const BUFFER = 300000; // milliseconds before MAX_IDLE_TIME expiration

class SessionHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkInterval: 300000, // 10 minutes
            action: '',
            activeSessionDialog: false,
            isDialogShown: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        // fire initial get of session data
        // this.getSessionLastActive(this.state.checkInterval);
        // get last active on indexeddb
        // if longer than MAX_IDLE_TIME logout
        const { allCookies } = this.props;
        if (allCookies.session) {
            localforage.getItem('last_active').then((value) => {
                if (value) {
                    const last = value.client > value.server ? value.client : value.server;
                    if (last + MAX_IDLE_TIME < Now()) {
                        this.onLogout();
                    } else {
                        this.sessionLastActiveInterval = setInterval(
                            this.getSessionLastActive,
                            this.state.checkInterval,
                        );
                    }
                } else { // as session exists and, for any reason, last_active doesn't, then set it
                    localforage.setItem('last_active', { server: Now(), client: Now() });
                }
            });
        } else {
            // if there is no session clear interval, listener
            clearInterval(this.sessionLastActiveInterval);
            window.removeEventListener('isOnline', this.getSessionLastActive);
        }
        // if is homepage check if session idle logout flag exists on server
        // this was meant to trigger only after /logout,
        // but still not able to find a way to get the correct referrer info
        if (this.props.location.pathname === '/') {
            this.checkSessionAfterLogoutRedirect();
        }
    }

    componentDidUpdate(prevProps) {
        const { location, isLogged } = this.props;
        if (prevProps.location.pathname !== location.pathname) {
            const { allCookies } = this.props;
            if (allCookies.session) {
                localforage.getItem('last_active').then((value) => {
                    if (value) {
                        const last = value.client > value.server ? value.client : value.server;
                        if (last + MAX_IDLE_TIME < Now()) {
                            this.onLogout();
                        } else {
                            const newLast = value;
                            newLast.client = Now();
                            localforage.setItem('last_active', newLast);
                        }
                    } else { // as session exists and, for any reason, last_active doesn't, set it
                        localforage.setItem('last_active', { server: Now(), client: Now() });
                    }
                });
            }
        }
        if (prevProps.isLogged !== isLogged && !isLogged) {
            this.onLogout();
        }
    }

    componentWillUnmount() {
        clearInterval(this.sessionLastActiveInterval);
        window.removeEventListener('isOnline', this.getSessionLastActive);
    }

    checkSessionAfterLogoutRedirect = () => {
        // this is the check if it was an idle logout and show notification
        localforage.getItem('idle_logout_flag').then((value) => {
            if (value) {
                this.setState({
                    action: 'show_logout_idle_message',
                    notification: {
                        status: 'show_logout_idle_message',
                        title: 'Vous avez été déconnecté',
                        message:
                            "Pour des raisons de sécurité, à cause d'inactivité",
                        errors: {},
                    },
                    activeSessionDialog: true,
                });
                localforage.removeItem('idle_logout_flag');
            }
        });
    };

    onLogout = () => {
        // sets the session idle logout flag on memcached that will be checked on componentDidMount
        localforage.setItem('idle_logout_flag', 1);
        clearInterval(this.sessionLastActiveInterval);
        this.setState({
            activeSessionDialog: false,
            action: 'logout',
        });
    };

    getSessionLastActive = () => {
        localforage.getItem('last_active').then((value) => {
            if (value) {
                const last = value.client > value.server ? value.client : value.server;
                const expire = last + MAX_IDLE_TIME;
                if (expire <= Now()) { // if expired log out
                    this.onLogout();
                } else if (!this.state.isDialogShown && expire <= Now() + BUFFER / 1000) {
                    // if within the buffer, show dialog
                    this.setState({
                        action: 'show_session_expire_warning',
                        notification: {
                            status: 'show_session_expire_warning',
                            title: 'Sécurité',
                            message: 'Vous serez déconnecté par manque d’activité',
                            errors: {},
                        },
                        activeSessionDialog: true,
                        isDialogShown: true,
                    });
                }
                // in the unlikely case that server is close to MAX_IDLE_TIME_SERVER
                // generate a request to refresh it
                if (value.server + MAX_IDLE_TIME_SERVER < Now() + 3600) {
                    this.makeRealRequestToRefreshServerSession();
                }
                // this is attempt to check server session and logout if none exists
                // after one hour server inactivity
                if (value.server + 3600 < Now()) {
                    this.props.actionCheckSession();
                }
            } else { // if, for any reason, last_active is not stored, set it
                localforage.setItem('last_active', { server: Now(), client: Now() });
            }
        });
    }

    handleSessionWarning = (event) => {
        // close dialog
        this.setState({
            action: '',
            activeSessionDialog: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        const buttonId = event.target.id;
        // if user clicks on extend then refresh last_active with request
        if (buttonId === 'session_extend') {
            this.makeRealRequestToRefreshServerSession();
        }
    };

    makeRealRequestToRefreshServerSession = () => {
        this.props.actionGetInitialDataForOffline();
    };

    render() {
        if (this.state.action === 'logout') {
            // eslint-disable-next-line no-restricted-globals
            location.assign('/logout');
            return null;
        }
        if (this.state.activeSessionDialog) {
            return (
                <div id="session_dialog">
                    <div>
                        <NotifierDialog
                            notification={this.state.notification}
                            handleSessionWarning={this.handleSessionWarning}
                        />
                    </div>
                </div>
            );
        }
        return null;
    }
}

SessionHandler.propTypes = {
    allCookies: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    actionGetInitialDataForOffline: PropTypes.func.isRequired,
    actionCheckSession: PropTypes.func.isRequired,
    isLogged: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.status.dataSession,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            actionCheckSession,
            actionGetInitialDataForOffline,
        },
        dispatch,
    );
}

export default withCookies(connect(
    mapStateToProps,
    mapDispatchToProps,
)(SessionHandler));
