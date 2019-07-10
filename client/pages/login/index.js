import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import localforage from 'localforage';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { withCookies, Cookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { LoadingVisibility, Loading } from '../../components/loading';
import { Now } from '../../tools/functions';
import LoginForm from './components/login_form';
import NotifierDialog from '../../components/notifier_dialog';
import NotifierInline from '../../components/notifier_inline';
import { actionLogin } from '../../store/actions';
import styles from './styles';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    onSubmitLogin = () => {
        this.setState({ isLoading: true });
        const submitForm = new Promise((resolve) => {
            resolve(this.props.actionLogin(this.props.login_form.values));
        });
        submitForm.then((result) => {
            console.log('login result', result);
            this.handlePostSubmitLogin(result);
        }).catch(() => {
            this.setState({
                isLoading: false,
                notification: {
                    status: 'error',
                    title: 'Unknown error',
                    message: 'Please try again',
                    errors: {},
                },
            });
        });
    }

    handlePostSubmitLogin = (result) => {
        if (result.error) { // seem to be offline
            // check if offline event already fired
            localforage.getItem('offline-event-fired').then((data) => {
                if (data === null) {
                    window.dispatchEvent(new Event('offline'));
                    localforage.setItem('offline-event-fired', true);
                }
            });
            this.setState({
                isLoading: false,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'You seem to be offline.',
                    message: 'Loggin in is not possible',
                    errors: {},
                },
            });
        } else {
            // TODO Code duplicated at /register-social
            const data = result.payload.data;
            if (data.status === 'ok') {
                // get referred path, ie, user intended url when redirected to login
                console.log('redirect from login', this.props);
                let redir = this.props.location.state || 'homepage';
                let from = this.props.location.state || '/';
                if (data.session_info.is_admin) {
                    from = this.props.location.state || '/admin';
                    redir = this.props.location.state || '/admin';
                }
                const message = () => {
                    return (
                        <React.Fragment>
                            <Typography variant="subtitle2">
                                This page will refresh momentarily.
                            </Typography>
                            <Typography variant="subtitle2" gutterBottom>
                                You will be redirected to
                                {redir}
                            </Typography>
                        </React.Fragment>
                    );
                };
                this.setState({
                    isLoading: false,
                    notification: {
                        status: 'ok',
                        title: 'You are now connected.',
                        message: message(),
                        errors: {},
                    },
                });
                localforage.setItem('bda_session', result.payload.data.session_info);
                localforage.setItem('last_active_client', Now());
                localforage.setItem('last_active_server', Now());
                // SET COOKIES
                const { cookies } = this.props;
                cookies.set('session', result.payload.data.session_info, { path: '/' });
                if (result.payload.data.pending_ad) {
                    localforage.removeItem('pending_ad_id');
                }
                // dispatch event to get user data from header component
                const username = { username: data.session_info.username };
                const getUserData = new CustomEvent('get_user_data', {
                    detail: {
                        username,
                    },
                });
                window.dispatchEvent(getUserData);
                // dispatch event to get initial data for offline
                // from header component in case ads where sent while offline
                const getInitialData = new CustomEvent('get_initial_data');
                window.dispatchEvent(getInitialData);
                // redirect user after timeout for notification
                console.log('from', from);
                setTimeout(() => {
                    this.props.history.push(from);
                }, 3000);
            } else if (result.payload.data.status === 'error') {
                this.setState({
                    isLoading: false,
                    notification: {
                        status: 'error',
                        title: 'There was an error.',
                        message: 'Your credentials are invalid.',
                        errors: {},
                    },
                });
            }
        }
    }

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }

    render() {
        console.log('login props', this.props);
        const { classes } = this.props;
        if (this.props.online_status.isOnline) {
            return (
                <React.Fragment>
                    <main id="login_page">
                        {this.state.isLoading ? <Loading /> : null}
                        <Card className={classes.root}>
                            <CardContent
                                className={classes.loginAction}
                            >
                                {this.props.location.state ? (
                                    <Typography>
                                        The page you tried to access
                                        requires login.
                                    </Typography>
                                ) : null}
                                <div className={classes.notMember}>
                                    <Link to="/registration">
                                        not yet a member? sign up
                                    </Link>
                                </div>
                                <LoginForm
                                    submitLogin={this.onSubmitLogin}
                                />
                            </CardContent>
                        </Card>

                        <NotifierDialog
                            notification={this.state.notification}
                            handleNotificationDismiss={
                                this.handleNotificationDismiss
                            }
                        />
                    </main>
                    <Footer />
                </React.Fragment>
            );
        }
        return (
            <NotifierInline
                message="You seem to be offline. Login is disabled."
            />
        );
    }
}

Login.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    actionLogin: PropTypes.func.isRequired,
    login_form: PropTypes.any,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    online_status: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        login_form: state.form.LoginForm,
        getUserDataForOffline: state.getUserDataForOffline,
        online_status: state.online_status,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionLogin,
    }, dispatch);
}

export default withCookies(
    withRouter(
        connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login)),
    ),
);
