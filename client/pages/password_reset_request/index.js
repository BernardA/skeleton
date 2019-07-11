import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { LoadingVisibility, Loading } from '../../components/loading';
import PasswordResetRequestForm from './components/password_reset_request_form';
import { actionRequestPasswordChange } from '../../store/actions';
import NotifierDialog from '../../components/notifier_dialog';
import NotifierInline from '../../components/notifier_inline';
import styles from './styles';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class PasswordResetRequest extends React.Component {
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

    onSubmitPasswordResetRequest = () => {
        this.setState({ isLoading: true });
        const submitForm = new Promise((resolve) => {
            resolve(this.props.actionRequestPasswordChange(
                this.props.password_reset_request_form.values,
            ));
        });
        submitForm.then((result) => {
            const message = result.payload.data.message;
            this.setState({
                isLoading: false,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Email sent.',
                    message,
                    errors: {},
                },
            });
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

    handleNotificationDismiss = () => {
        const status = this.state.notification.status;
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
        if (status === 'ok_and_dismiss') {
            this.props.history.push('/');
        }
    }

    render() {
        const { classes } = this.props;
        if (this.props.online_status.isOnline) {
            return (
                <React.Fragment>
                    <main>
                        {this.state.isLoading ?
                            <Loading />
                            :
                            null
                        }
                        <Card className={classes.root}>
                            <CardHeader
                                className={classes.header}
                                title={(
                                    <Typography className={classes.title} component="h3">
                                        Password reset request
                                    </Typography>
                                )}
                                subheader={(
                                    <Typography className={classes.subheader} component="p">
                                        Enter your email below
                                    </Typography>
                                )}
                            />

                            <CardContent className={classes.content}>
                                <PasswordResetRequestForm
                                    requestPasswordChange={this.onSubmitPasswordResetRequest}
                                />
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
        return (
            <NotifierInline
                message="You seem to be offline. Password reset is disabled."
            />
        );
    }
}

PasswordResetRequest.propTypes = {
    actionRequestPasswordChange: PropTypes.func.isRequired,
    password_reset_request_form: PropTypes.any,
    history: PropTypes.object.isRequired,
    online_status: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        password_reset_request_form: state.form.PasswordResetRequestForm,
        requestPasswordChange: state.requestPasswordChange,
        online_status: state.online_status,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionRequestPasswordChange,
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(PasswordResetRequest));
