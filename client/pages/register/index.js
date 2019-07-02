import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import localforage from 'localforage';
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
            isLoading: false,
            status: null,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    onSubmitRegister = () => {
        this.setState({
            isLoading: true,
        });
        const values = this.props.register_form.values;

        const submitAddressForm = new Promise((resolve) => {
            resolve(this.props.actionInsertAddress(values));
        });
        console.log('register form values', values);
        submitAddressForm.then((result) => {
            console.log('result address form', result.payload.data);
            if (result.payload.data.status === 'error') {
                this.setState({
                    isLoading: false,
                    status: 'error',
                    notification: {
                        status: 'error',
                        title: 'There was an error.',
                        message: 'Please review the following:',
                        errors: result.payload.data.errors,
                    },
                });
                return;
            }
            // eslint-disable-next-line max-len
            this.props.register_form.values.fos_user_registration_form.address_id = result.payload.data.address_id;
            // eslint-disable-next-line consistent-return
            return this.props.register_form.values;
        }).then((result) => {
            const submitForm = new Promise((resolve) => {
                resolve(this.props.actionRegister(result));
            });
            submitForm.then((result1) => {
                if (result1.payload.data.status === 'error') {
                    this.setState({
                        isLoading: false,
                        status: 'error',
                        notification: {
                            status: 'error',
                            title: 'There was an error.',
                            message: 'Please review the following:',
                            errors: result1.payload.data.errors,
                        },
                    });
                    return;
                }
                if (result.payload.data.pending_ad) {
                    localforage.removeItem('pending_ad_id');
                    // dispatch event to get initial data for offline
                    // from header component in order to show the just published ad
                    const getInitialData = new CustomEvent('get_initial_data');
                    window.dispatchEvent(getInitialData);
                }
                const message = `A confirmation e-mail was sent to 
                    ${result.payload.data.email}. 
                    Please check your mailbox and click on the link on that e-mail.`;
                this.setState({
                    isLoading: false,
                    status: 'ok',
                    notification: {
                        status: 'ok_and_dismiss',
                        title: 'You are now registered.',
                        message,
                        errors: {},
                    },
                });
            });
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
        if (this.state.status === 'ok') {
            this.props.history.push('/');
        } else if (this.state.status === 'ok-social') {
            this.props.history.push('/registration-social');
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
                            <CardContent className={classes.loginAction}>
                                <div className={classes.notMember}>
                                    <Link to="/login">already a member? login </Link>
                                </div>
                                <RegisterForm
                                    submitRegister={this.onSubmitRegister}
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
    register_form: PropTypes.any,
    actionInsertAddress: PropTypes.func.isRequired,
    actionRegister: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    online_status: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        socialRegisterGoogle: state.socialRegisterGoogle,
        register_form: state.form.RegisterForm,
        register: state.register,
        insertAddress: state.insertAddress,
        online_status: state.online_status,
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
