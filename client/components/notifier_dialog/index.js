import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const theme = createMuiTheme({
    overrides: {
        MuiDialog: {
            paperFullWidth: {
                margin: 0,
            },
        },
    },
});


class NotifierDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    }

    errors = () => {
        const errors = this.props.notification.errors;
        if (errors.length > 0) {
            const output = errors.map((error) => {
                const key = Object.keys(error)[0];
                return (
                    <li key={key}>{`${key} - ${error[key]}`}</li>
                );
            });
            return (
                <ul>
                    {output}
                </ul>
            );
        }
        return null;
    }

    actions = () => {
        switch (this.props.notification.status) {
        case 'ok_and_dismiss':
            return (
                <Button
                    id="dismiss_notification"
                    onClick={this.props.handleNotificationDismiss}
                    color="primary"
                    autoFocus
                >
                        Dismiss
                </Button>
            );
        case 'error':
            return (
                <Button
                    id="dismiss_notification"
                    onClick={this.props.handleNotificationDismiss}
                    color="primary"
                    autoFocus
                >
                        Dismiss
                </Button>
            );
        case 'show_session_expire_warning':
            return (
                <React.Fragment>
                    <Button
                        id="session_expire"
                        onClick={this.props.handleSessionWarning}
                        color="primary"
                    >
                            Let expire
                    </Button>
                    <Button
                        id="session_extend"
                        onClick={this.props.handleSessionWarning}
                        color="primary"
                        autoFocus
                    >
                            Extend
                    </Button>
                </React.Fragment>
            );
        case 'show_logout_idle_message':
            return (
                <Button
                    id="session_logout"
                    onClick={this.props.handleSessionWarning}
                    color="primary"
                    autoFocus
                >
                        Dismiss
                </Button>
            );
        case 'post_insert_ad_register':
            return (
                <div>
                    <Button
                        className="toggle_login"
                        variant="outlined"
                        color="primary"
                        onClick={this.props.handleNotificationDismiss}
                    >
                            Login
                    </Button>
                    <Button
                        className="toggle_register"
                        variant="outlined"
                        color="primary"
                        onClick={this.props.handleNotificationDismiss}
                    >
                            Register
                    </Button>
                </div>
            );
        case 'post_insert_ad_logged_in':
            return (
                <div>
                    <Button
                        component={Link}
                        to={`/adview/${this.props.adId}`}
                        variant="outlined"
                        color="primary"
                        onClick={this.handleNotificationDismiss}
                    >
                            Go to ad
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.handleNotificationDismiss}
                    >
                            Dismiss
                    </Button>
                </div>
            );
        case 'confirm_delete':
            return (
                <div>
                    <Button
                        id="confirmed"
                        variant="outlined"
                        color="primary"
                        onClick={this.props.handleNotificationDismiss}
                    >
                            Confirm
                    </Button>
                    <Button
                        id="cancelled"
                        variant="outlined"
                        color="primary"
                        onClick={this.props.handleNotificationDismiss}
                    >
                            Cancel
                    </Button>
                </div>
            );
        default:
            return null;
        }
    }

    render() {
        if (this.props.notification.status !== '') {
            return (
                <MuiThemeProvider theme={theme}>
                    <Dialog
                        className="notification"
                        open={this.state.open}
                        fullWidth
                    >
                        <DialogTitle className="notification_title">
                            {this.props.notification.title}
                        </DialogTitle>
                        <DialogContent className="notification_content">
                            <div>{this.props.notification.message}</div>
                            {this.errors()}
                        </DialogContent>
                        <DialogActions className="notification_action">
                            {this.actions()}
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            );
        }
        return null;
    }
}

NotifierDialog.propTypes = {
    notification: PropTypes.object.isRequired,
    handleNotificationDismiss: PropTypes.func,
    handleSessionWarning: PropTypes.func,
    adId: PropTypes.number,
};

export default NotifierDialog;
