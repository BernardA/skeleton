import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
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
        localforage.getItem('last_active_server').then((value) => {
            if (value && value + MAX_IDLE_TIME < Now()) {
                this.onLogout();
            } else {
                this.sessionLastActiveInterval = setInterval(
                    this.getSessionLastActive,
                    this.state.checkInterval,
                );
                // if is homepage check if session idle logout flag exists on server
                // this was meant to trigger only after /logout,
                // but still not able to find a way to get the correct referrer info
                if (this.props.location.pathname === '/') {
                    this.checkSessionAfterLogoutRedirect();
                }
            }
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            localforage.getItem('last_active_server').then((value) => {
                if (value && value + MAX_IDLE_TIME < Now()) {
                    this.onLogout();
                } else {
                    localforage.setItem('last_active_client', Now());
                }
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.sessionLastActiveInterval);
        window.removeEventListener('isOnline', this.getSessionLastActive);
    }

    checkSessionAfterLogoutRedirect = () => {
        // this is the check if it was an idle logout and show notification
        // THIS DOES NOT WORK WITHOUT MEMCACHED ON SERVER SIDE - USING INDEXEDDB INSTEAD
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
        // THIS DOES NOT WORK ON SERVER WITHOUT MEMCACHED - PUT FLAG ON INDEXEDDB INSTEAD
        localforage.setItem('idle_logout_flag', 1);
        const getApiSession = new Promise((resolve) => {
            resolve(
                this.props.actionCheckSession('set_session_idle_logout_flag'),
            );
        });
        getApiSession
            .then(() => {
                // even if an error occurs on server side user should be logged out
                this.setState({
                    activeSessionDialog: false,
                    action: 'logout',
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getSessionLastActive = () => {
        const getApiSession = new Promise((resolve) => {
            resolve(this.props.actionCheckSession(0));
        });
        getApiSession
            .then((result) => {
                const data = result.payload.data;
                console.log('check session result', result);
                localforage.getItem('bda_session').then((value) => {
                    if (value && !data.is_logged) {
                        this.setState({
                            action: 'logout',
                        });
                        localforage.setItem('idle_logout_flag', 1);
                    } else if (value && data.is_logged) {
                        console.log('get session last active');
                        // window.removeEventListener("isOnline", this.getSessionLastActive);
                        localforage.getItem('bda_session').then((value1) => {
                            console.log('last active bda session', value1);
                            if (value1) {
                                localforage
                                    .getItem('last_active_client')
                                    .then((client) => {
                                        if (client) {
                                            console.log(
                                                'last active client',
                                                client,
                                            );
                                            localforage
                                                .getItem('last_active_server')
                                                .then((server) => {
                                                    console.log(
                                                        'last active server',
                                                        server,
                                                    );
                                                    if (server) {
                                                        // set expire to the most recent of
                                                        // server or client + max idle time
                                                        const expireServer =
                                                            server +
                                                            MAX_IDLE_TIME;
                                                        const expire =
                                                            client +
                                                                MAX_IDLE_TIME >
                                                            expireServer
                                                                ? client +
                                                                  MAX_IDLE_TIME
                                                                : expireServer;
                                                        // check if is close to expire on the
                                                        // server side and refresh it if necessary
                                                        console.log(
                                                            'last active expire',
                                                            expire,
                                                        );
                                                        console.log(
                                                            'last active NOW',
                                                            Now(),
                                                        );
                                                        console.log(
                                                            'Now() + BUFFER / 1000',
                                                            Now() +
                                                                BUFFER / 1000,
                                                        );
                                                        if (expire <= Now()) {
                                                            // if expires has passed should be
                                                            // logged out,though this should
                                                            // not happen if below is done properly
                                                            this.onLogout();
                                                        } else if (
                                                            !this.state
                                                                .isDialogShown &&
                                                            expire <=
                                                                Now() +
                                                                    BUFFER /
                                                                        1000
                                                        ) {
                                                            // if within the buffer, show dialog
                                                            this.setState({
                                                                action:
                                                                    'show_session_expire_warning',
                                                                notification: {
                                                                    status:
                                                                        'show_session_expire_warning',
                                                                    title:
                                                                        'Sécurité',
                                                                    message:
                                                                        'Vous serez déconnecté par manque d’activité',
                                                                    errors: {},
                                                                },
                                                                activeSessionDialog: true,
                                                                isDialogShown: true,
                                                            });
                                                        } else {
                                                            // should be close to get to buffer,
                                                            // so recalculate checkInterval
                                                            console.log(
                                                                'client - server > MAX_IDLE_TIME * 1000 - BUFFER',
                                                                client -
                                                                    server >
                                                                    MAX_IDLE_TIME *
                                                                        1000 -
                                                                        BUFFER,
                                                            );
                                                            if (
                                                                client -
                                                                    server >
                                                                MAX_IDLE_TIME *
                                                                    1000 -
                                                                    BUFFER
                                                            ) {
                                                                // eslint-disable-next-line max-len
                                                                this.makeRealRequestToRefreshServerSession();
                                                            }
                                                        }
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

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
        // if user clicks on extend then update last active on server
        if (buttonId === 'session_extend') {
            const getApiSession = new Promise((resolve) => {
                resolve(this.props.actionCheckSession('extend'));
            });
            getApiSession
                .then((result) => {
                    if (!result.payload.data.is_logged) {
                        this.onLogout();
                    } else {
                        this.setState({
                            isDialogShown: false,
                        });
                        this.makeRealRequestToRefreshServerSession();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    makeRealRequestToRefreshServerSession = () => {
        const newPromise = new Promise((resolve) => {
            resolve(this.props.actionGetInitialDataForOffline());
        });
        newPromise
            .then((result) => {
                localforage.setItem('last_active_server', Now());
                const data = result.payload.data;
                // set indexeddb
                localforage.setItem('timestamp-initialdata', new Date());
                localforage.setItem('pages', data.pages);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        if (this.state.action === 'logout') {
            localforage.removeItem('bda_session');
            localforage.removeItem('last_active_client');
            localforage.removeItem('last_active_server');
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
    location: PropTypes.object.isRequired,
    actionCheckSession: PropTypes.func.isRequired,
    actionGetInitialDataForOffline: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        check_session: state.check_session,
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SessionHandler);
