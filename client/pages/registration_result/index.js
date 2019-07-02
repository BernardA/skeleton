import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import { LoadingVisibility } from '../../components/loading';
import NotifierDialog from '../../components/notifier_dialog';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class RegistrationResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        console.log('registrationresult MOUNT', this.props);
        const status = this.props.match.params.status;
        if (status === 'failed') {
            this.setState({
                status,
                notification: {
                    status: 'error',
                    title: 'There was an error.',
                    message: 'Invalid or expired token ',
                    errors: {},
                },
            });
        } else if (status === 'success') {
            this.setState({
                status,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Your registration is  confirmed!',
                    message: 'Dismiss this and login ',
                    errors: {},
                },
            });
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
        if (this.state.status === 'success') {
            this.props.history.push('/login');
        } else {
            this.props.history.push('/');
        }
    }

    render() {
        console.log('registrationresult state', this.state);
        return (
            <React.Fragment>
                <main>
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

RegistrationResult.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

const mapStateToProps = () => {
    return {
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationResult);
