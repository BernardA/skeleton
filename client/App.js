import React, { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import axios from 'axios';
import localforage from 'localforage';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import PrivateRoute from './auth/auth';
import Meta from './components/meta';
import Header from './components/header';
import { Loading } from './components/loading';
import ErrorBoundary from './components/error_boundary';
import { Now } from './tools/functions';


const Fallback = (Component) => {
    return props => (
        <ErrorBoundary>
            <Suspense fallback={<Loading />}>
                <Component {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

const HomePage = lazy(() => import('./pages/home/'));
const AdminPage = lazy(() => import('./pages/admin/'));
const Logout = lazy(() => import('./components/logout'));
const AccountPage = lazy(() => import('./pages/account/'));
const RegistrationResultPage = lazy(() => import('./pages/registration_result/'));
const PasswordResetHandlerPage = lazy(() => import('./pages/password_reset_handler/'));
const AttachmentViewer = lazy(() => import('./components/attachment_viewer'));
const Page404 = lazy(() => import('./pages/page404/'));
const LoginPage = lazy(() => import('./pages/login'));
const RegisterPage = lazy(() => import('./pages/register'));
const PasswordResetRequestPage = lazy(() => import('./pages/password_reset_request'));

/*
ONLINE/OFFLINE STATUS comments
Using a combination of native window.online and actually sending a request to confirm.
This given the lack of reliability of window.online.
 - on componentDidMount isOnlineInterval is triggered with a high interval just to set it up.
   Also listeners are added for native events and also for custom isOffline event.
   The latter is dispatched when one of the child components axios requests fail.
- updateOnlineStatus is triggered by any of the online/offline events
   and sends a fetch requests to confirm.
   If confirmed:
   - an event is fired to the child components
   - the redux state is updated
   - a flag for offline event is added or removed from indexedDB
   - if offline, it will trigger its own setInterval to check for status
- on componentWillUnmount the subscriptions are cancelled
- child components do not rely on online/offine status to initiate axios.
  Instead they will attempt and, if fail, dispatch an offline event.
  They DO NOT listen to the native online/offline events, only to the custom ones.
- child components will show UI based upon redux state by using redux connect.

*/

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnline: null,
            onlineCheckInterval: 600000,
        };
    }

    componentDidMount() {
        this.updateOnlineStatus();
        this.isOnlineInterval = setInterval(
            this.updateOnlineStatus,
            this.state.onlineCheckInterval,
        );
        window.addEventListener('online', this.updateOnlineStatus);
        window.addEventListener('offline', this.updateOnlineStatus);
        // window.addEventListener('isOffline', this.updateOnlineStatus);
        // XSRF https://stackoverflow.com/questions/54571247/do-i-have-to-use-csrf-protection-in-react-spa
        axios
            .get('/api/csrf') // Send get request to get CSRF token once site is visited.
            .then((result) => {
                console.log('axios token result', result);
                axios.defaults.headers.post['X-XSRF-TOKEN'] =
                    result.data.csrfToken; // Set it in header for the rest of the axios requests.
            });
        // add interceptor to axios to update last_active_server
        const instance = axios.create();
        instance.interceptors.request.use((config) => {
            localforage.getItem('last_active').then((value) => {
                if (value) {
                    const last = value;
                    last.server = Now();
                    localforage.setItem('last_active', last);
                }
                localforage.setItem('last_active', { server: Now(), client: Now() });
                return config;
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.isOnlineInterval);
        window.removeEventListener('online', this.updateOnlineStatus);
        window.removeEventListener('offline', this.updateOnlineStatus);
        window.removeEventListener('isOffline', this.updateOnlineStatus);
    }

    updateOnlineStatus = () => {
        const fireEvent = (name) => {
            console.log('event fired', name);
            window.dispatchEvent(new Event(name));
        };

        const updateState = (status = 0) => {
            if (status === 200) {
                if (!this.state.isOnline) {
                    this.setState({ isOnline: true });
                    // send event isOnline
                    fireEvent('isOnline');
                    // update redux state
                    this.props.store.dispatch({
                        type: 'ONLINE_STATUS',
                        isOnline: true,
                    });
                    // clears indexedDB offline event flag
                    localforage.removeItem('offline-event-fired');
                }
            } else if (this.state.isOnline === true || this.state.isOnline === null) {
                this.setState({ isOnline: false });
                // send event isOffline
                fireEvent('isOffline');
                this.props.store.dispatch({
                    type: 'ONLINE_STATUS',
                    isOnline: false,
                });
                // check if offline event already fired
                localforage.getItem('offline-event-fired').then((data) => {
                    if (data === null) {
                        localforage.setItem('offline-event-fired', true);
                    }
                });
                // setInterval to check status
                clearInterval(this.isOnlineInterval); // clear existing one
                this.isOnlineInterval = setInterval(this.checkIsOnline, 30000);
            }
        };

        fetch('/favicon.ico')
            .then((response) => {
                if (response.status === 200) {
                    // is online
                    console.log('is online');
                    updateState(response.status);
                } else {
                    // is offline
                    console.log('other response status than 200');
                    updateState();
                }
            })
            .catch((error) => {
                // is offline
                console.log(error);
                console.log('app.js is offline, maybe');
                updateState();
            });
    };

    render() {
        console.log('app props', this.props);
        return (
            <Router>
                <Provider store={this.props.store}>
                    <React.Fragment>
                        <CssBaseline />
                        <ErrorBoundary>
                            <Suspense fallback={<Loading />}>
                                <Meta />
                            </Suspense>
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Suspense fallback={<Loading />}>
                                <Header />
                            </Suspense>
                        </ErrorBoundary>
                        <Switch>
                            <Route
                                path="/resetting/reset/:token"
                                component={Fallback(PasswordResetHandlerPage)}
                            />
                            <Route
                                path="/registration-result/:status"
                                component={Fallback(RegistrationResultPage)}
                            />
                            <PrivateRoute
                                exact
                                path="/account"
                                component={Fallback(AccountPage)}
                            />
                            <Route
                                path="/logout"
                                component={Fallback(Logout)}
                            />
                            <Route
                                path="/login"
                                component={Fallback(LoginPage)}
                            />
                            <Route
                                path="/password-reset-request"
                                component={Fallback(PasswordResetRequestPage)}
                            />
                            <Route
                                exact
                                path="/registration"
                                component={Fallback(RegisterPage)}
                            />
                            <PrivateRoute
                                path="/admin"
                                component={Fallback(AdminPage)}
                            />
                            <PrivateRoute
                                path="/viewer/:origin/:origin_id/:file_name"
                                component={Fallback(AttachmentViewer)}
                            />
                            <Route
                                exact
                                path="/"
                                component={Fallback(HomePage)}
                            />
                            <Route component={Fallback(Page404)} />
                        </Switch>
                    </React.Fragment>
                </Provider>
            </Router>
        );
    }
}

Root.propTypes = {
    store: PropTypes.object.isRequired,
};

export default Root;
