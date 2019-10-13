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
        if (this.props.match.params.token) {
            this.props.actionSubmitPasswordResetToken(this.props.match.params.token);
        } else {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Missing token',
                    errors: {},
                },
            });
        }
    }

    componentDidUpdate(prevProps) {
        const {
            dataChangePassword,
            dataResetToken,
            errorResetToken,
            errorChangePassword,
        } = this.props;
        if (!prevProps.dataResetToken && dataResetToken) {
            this.setState({
                active: true,
            });
        }
        if (!prevProps.errorResetToken && errorResetToken) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Token expired or invalid',
                    message: 'Try to login or request a new password once more.',
                    errors: {},
                },
            });
        }
        if (!prevProps.dataChangePassword && dataChangePassword) {
            this.setState({
                notification: {
                    status: 'ok',
                    title: dataChangePassword.message,
                    message: 'You will be redirected to login page',
                    errors: {},
                },
            });
            // redirect user after timeout for notification
            setTimeout(() => {
                this.props.history.push('/login');
            }, 3000);
        }
        if (!prevProps.errorChangePassword && errorChangePassword) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'An error has occurred:',
                    message: '',
                    errors: {},
                },
            });
        }
    }

    onSubmitPasswordReset = () => {
        const { passwordResetForm, match } = this.props;
        this.props.actionChangePassword(passwordResetForm.values, match.params.token);
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
        const { classes, isLoading } = this.props;
        return (
            <React.Fragment>
                <main>
                    {isLoading ? <Loading /> : null}
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
    passwordResetForm: PropTypes.any,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    dataChangePassword: PropTypes.any,
    dataResetToken: PropTypes.any,
    errorResetToken: PropTypes.any,
    errorChangePassword: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        passwordResetForm: state.form.PasswordResetForm,
        dataResetToken: state.auth.dataResetToken,
        dataChangePassword: state.auth.dataChangePassword,
        errorResetToken: state.auth.errorResetToken,
        errorChangePassword: state.auth.errorChangePassword,
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
