import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import { LoadingVisibility, Loading } from '../../components/loading';
import RegisterForm from './components/register_form';
import NotifierDialog from '../../components/notifier_dialog';
import NotifierInline from '../../components/notifier_inline';
import {
    actionRegister,
    actionInsertAddress,
} from '../../store/actions';
import styles from './styles';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class Register extends React.Component {
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
        const {
            addressId,
            registerForm,
            errorReq,
            dataRegister,
        } = this.props;
        if (!prevProps.errorReq && errorReq) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Please review the following:',
                    errors: errorReq,
                },
            });
        }
        if (!prevProps.addressId && addressId) {
            registerForm.values.fos_user_registration_form.address_id = addressId;
            this.props.actionRegister(registerForm.values);
        }
        if (!prevProps.dataRegister && dataRegister) {
            const message = `A confirmation e-mail was sent to ${dataRegister.email}. 
            Please check your mailbox and click on the link on that e-mail.`;
            this.setState({
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'You are now registered.',
                    message,
                    errors: {},
                },
            });
        }
    }

    onSubmitRegister = () => {
        const values = this.props.registerForm.values;
        this.props.actionInsertAddress(values);
    }

    handleToggleVisiblePassword = () => {
        this.setState(prevState => ({
            isPasswordMasked: !prevState.isPasswordMasked,
        }));
    };

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
        if (status === 'ok') {
            this.props.history.push('/');
        }
    }

    render() {
        const { classes, isLoading, isOnline } = this.props;
        if (isOnline) {
            return (
                <React.Fragment>
                    <main>
                        {isLoading ? <Loading /> : null}
                        <Card className={classes.root}>
                            <CardHeader
                                className={classes.header}
                                title={(
                                    <Typography className={classes.title} component="h3">
                                            Registration
                                    </Typography>
                                )}
                            />
                            <CardContent className={classes.content}>
                                <div className={classes.notMember}>
                                    <Link to="/login">already a member? login </Link>
                                </div>
                                <RegisterForm
                                    submitRegister={this.onSubmitRegister}
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
                            handleNotificationDismiss={this.handleNotificationDismiss}
                        />
                    </main>
                    <Footer />
                </React.Fragment>
            );
        }
        return (
            <main>
                <NotifierInline
                    message="You seem to be offline. Register is disabled."
                />
            </main>
        );
    }
}

Register.propTypes = {
    registerForm: PropTypes.any,
    actionInsertAddress: PropTypes.func.isRequired,
    actionRegister: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    isOnline: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    errorReq: PropTypes.any,
    addressId: PropTypes.any,
    dataRegister: PropTypes.any,
};

const mapStateToProps = (state) => {
    return {
        ...state.register,
        registerForm: state.form.RegisterForm,
        isOnline: state.status.isOnline,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionRegister,
        actionInsertAddress,
    }, dispatch);
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Register)),
);
