import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { withCookies, Cookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { LoadingVisibility, Loading } from '../../components/loading';
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
            isPasswordMasked: true,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const { userId, isOnline, errorLogin } = this.props;
        if (prevProps.userId !== userId && userId) {
            this.handlePostSubmitLogin();
        }
        if (prevProps.isOnline !== isOnline && !isOnline) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'You seem to be offline.',
                    message: 'Loggin in is not possible',
                    errors: {},
                },
            });
        }
        if (prevProps.errorLogin !== errorLogin && errorLogin) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: errorLogin.message,
                    errors: {},
                },
            });
        }
    }

    onSubmitLogin = () => {
        this.props.actionLogin(this.props.loginForm.values);
    }

    handlePostSubmitLogin = () => {
        const { userId, sessionInfo } = this.props;
        if (userId) {
            // TODO Code duplicated at /register-social
            // get referred path, ie, user intended url when redirected to login
            console.log('redirect from login', this.props);
            let redir = this.props.location.state || 'homepage';
            let from = this.props.location.state || '/';
            if (sessionInfo.isAdmin) {
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
                notification: {
                    status: 'ok',
                    title: 'You are now connected.',
                    message: message(),
                    errors: {},
                },
            });
            // SET COOKIES
            const { cookies } = this.props;
            cookies.set('session', sessionInfo, { path: '/' });
            // dispatch event to get user data from header component
            const username = { username: sessionInfo.username };
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
        }
    }

    handleToggleVisiblePassword = () => {
        this.setState(prevState => ({
            isPasswordMasked: !prevState.isPasswordMasked,
        }));
    };

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
        const { classes, isLoading, isOnline } = this.props;
        if (isOnline) {
            return (
                <React.Fragment>
                    <main id="login_page">
                        {isLoading ? <Loading /> : null}
                        <Card id="noShadow" className={classes.root}>
                            <CardHeader
                                className={classes.header}
                                title={(
                                    <Typography className={classes.title} component="h3">
                                        Login
                                    </Typography>
                                )}
                                subheader={this.props.location.state ? (
                                    <Typography className={classes.subheader}>
                                        The page you tried to access requires login.
                                    </Typography>
                                ) : null}
                            />
                            <CardContent
                                className={classes.content}
                            >
                                <div className={classes.notMember}>
                                    <Link to="/registration">
                                        not yet a member? sign up
                                    </Link>
                                </div>
                                <LoginForm
                                    submitLogin={this.onSubmitLogin}
                                    isPasswordMasked={
                                        this.state.isPasswordMasked
                                    }
                                    handleToggleVisiblePassword={
                                        this.handleToggleVisiblePassword
                                    }
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
    isLoading: PropTypes.bool.isRequired,
    loginForm: PropTypes.any,
    userId: PropTypes.any,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    isOnline: PropTypes.bool.isRequired,
    errorLogin: PropTypes.any,
    sessionInfo: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.auth,
        isOnline: state.status.isOnline,
        loginForm: state.form.LoginForm,
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
