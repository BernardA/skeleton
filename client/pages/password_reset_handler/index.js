import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import { LoadingVisibility, Loading } from '../../components/loading';
import { actionSubmitPasswordResetToken, actionChangePassword } from '../../store/actions';
import PasswordResetForm from './components/password_reset_form';
import NotifierDialog from '../../components/notifier_dialog';
import styles from './styles';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class PasswordResetHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            active: false,
            isPasswordMasked: true,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        console.log('password reset component did MOUNT');
        this.setState({ isLoading: true });
        const getResetForm = new Promise((resolve) => {
            resolve(this.props.actionSubmitPasswordResetToken(this.props.match.params.token));
        });
        getResetForm.then((result) => {
            if (result.payload.data.status === 'error') {
                this.setState({
                    isLoading: false,
                    notification: {
                        status: 'error',
                        title: 'Token expired or invalid',
                        message: 'Try to login or request a new password once more.',
                        errors: {},
                    },
                });
            } else {
                this.setState({
                    isLoading: false,
                    active: true,
                });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Token expired or invalid',
                    message: 'Try to login or request a new password once more.',
                    errors: {},
                },
            });
        });
    }

    onSubmitPasswordReset = () => {
        this.setState({ isLoading: true });
        // this.setState({passwordResetResponse: {}});
        const submitForm = new Promise((resolve) => {
            resolve(this.props.actionChangePassword(
                this.props.password_reset_form.values, this.props.match.params.token,
            ));
        });
        submitForm.then((result) => {
            if (result.payload.data.status === 'ok') {
                console.log('payload.data', result.payload.data);
                this.setState({
                    isLoading: false,
                    notification: {
                        status: 'ok',
                        title: result.payload.data.message,
                        message: 'You will be redirected to login page',
                        errors: {},
                    },
                });
                // redirect user after timeout for notification
                setTimeout(() => {
                    this.props.history.push('/login');
                }, 3000);
            } else if (result.payload.data.status === 'error') {
                const errors1 = [];
                for (const key in result.payload.data.message) {
                    if (
                        Object.prototype.hasOwnProperty
                            .call(
                                result.payload.data.message,
                                key,
                            )
                    ) {
                        errors1.push(
                            result.payload.data.message[
                                key
                            ],
                        );
                    }
                }
                const errors = errors1.map((item) => {
                    return <li key={item}>{item}</li>;
                });
                this.setState({
                    isLoading: false,
                    notification: {
                        status: 'error',
                        title: 'An error has occurred:',
                        message: '',
                        errors,
                    },
                });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Unknown error',
                    message: 'Please try again',
                    errors: {},
                },
            });
        });
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
        const { classes } = this.props;
        return (
            <React.Fragment>
                <main>
                    {this.state.isLoading ? <Loading /> : null}
                    <Card className={classes.root}>
                        <CardHeader
                            className={classes.header}
                            title={(
                                <Typography className={classes.title} component="h3">
                                    Password reset
                                </Typography>
                            )}
                        />
                        <CardContent
                            className={classes.content}
                        >
                            {
                                this.state.active ? (
                                    <PasswordResetForm
                                        onSubmitPasswordResetForm={this.onSubmitPasswordReset}
                                        isPasswordMasked={
                                            this.state.isPasswordMasked
                                        }
                                        handleToggleVisiblePassword={
                                            this.handleToggleVisiblePassword
                                        }
                                    />
                                )
                                    :
                                    null
                            }
                        </CardContent>
                    </Card>
                    <NotifierDialog
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                    />
                </main>
                <Footer />
            </React.Fragment>
        );
    }
}

PasswordResetHandler.propTypes = {
    actionSubmitPasswordResetToken: PropTypes.func.isRequired,
    actionChangePassword: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    password_reset_form: PropTypes.any,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        password_reset_form: state.form.PasswordResetForm,
        submitPasswordResetToken: state.submitPasswordResetToken,
        changePassword: state.changePassword,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionSubmitPasswordResetToken,
        actionChangePassword,
    }, dispatch);
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(PasswordResetHandler)));
