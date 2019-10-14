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
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidUpdate(prevProps) {
        const { dataRequestPassword } = this.props;
        if (!prevProps.dataRequestPassword && dataRequestPassword) {
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Email sent.',
                    message: dataRequestPassword.message,
                    errors: {},
                },
            });
        }
    }

    onSubmitPasswordResetRequest = () => {
        const values = this.props.password_reset_request_form.values;
        this.props.actionRequestPasswordChange(values);
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
        const { classes, isLoading, isOnline } = this.props;
        if (isOnline) {
            return (
                <>
                    <main>
                        {isLoading ? <Loading /> : null}
                        <Card id="noShadow" className={classes.root}>
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
                </>
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
    isLoading: PropTypes.bool.isRequired,
    actionRequestPasswordChange: PropTypes.func.isRequired,
    password_reset_request_form: PropTypes.any,
    history: PropTypes.object.isRequired,
    isOnline: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    dataRequestPassword: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.auth,
        password_reset_request_form: state.form.PasswordResetRequestForm,
        isOnline: state.status.isOnline,
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
