import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import { LoadingVisibility } from '../../components/loading';
import { actionSubmitPasswordResetToken, actionChangePassword } from '../../store/actions';
import PasswordResetForm from './components/password_reset_form';
import NotifierDialog from '../../components/notifier_dialog';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class PasswordResetHandler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
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
        const getResetForm = new Promise((resolve) => {
            resolve(this.props.actionSubmitPasswordResetToken(this.props.match.params.token));
        });
        getResetForm.then((result) => {
            if (result.payload.data.status === 'error') {
                this.setState({
                    notification: {
                        status: 'error',
                        title: 'Token expired or invalid',
                        message: 'Try to login or request a new password once more.',
                        errors: {},
                    },
                });
            } else {
                this.setState({ active: true });
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
                const errors = errors1.map((item, i) => {
                    return <li key={i}>{item}</li>;
                });
                this.setState({
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
        });
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
        const isNotification = () => {
            if (this.state.notification.status === 'error') {
                return (
                    <NotifierDialog
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                    />
                );
            }
            return null;
        };

        const isForm = () => {
            if (this.state.active) {
                return (
                    <React.Fragment>
                        <PasswordResetForm onSubmitPasswordResetForm={this.onSubmitPasswordReset} />
                        <div>
                            <NotifierDialog
                                notification={this.state.notification}
                                handleNotificationDismiss={this.handleNotificationDismiss}
                            />
                        </div>
                    </React.Fragment>
                );
            }
            return null;
        };
        if (isNotification() != null || isForm() != null) {
            return (
                <React.Fragment>
                    <main>
                        {isNotification()}
                        {isForm()}
                    </main>
                    <Footer />
                </React.Fragment>
            );
        }
        return null;
    }
}

PasswordResetHandler.propTypes = {
    actionSubmitPasswordResetToken: PropTypes.func.isRequired,
    actionChangePassword: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    password_reset_form: PropTypes.any,
    history: PropTypes.object.isRequired,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PasswordResetHandler));
