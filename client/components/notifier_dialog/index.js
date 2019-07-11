import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import styles from './styles';

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.title}>
            <Typography variant="h6" className={classes.h6}>{children}</Typography>
        </MuiDialogTitle>
    );
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
        const { classes } = this.props;
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
                        className={classes.buttonLeft}
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
                        className={classes.buttonLeft}
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
                        className={classes.buttonLeft}
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
        const { classes } = this.props;
        if (this.props.notification.status !== '') {
            return (
                <Dialog
                    className={classes.paperFullWidth}
                    open={this.state.open}
                    fullWidth
                >
                    <DialogTitle>
                        {this.props.notification.title}
                    </DialogTitle>
                    <DialogContent className={classes.content}>
                        <div className={classes.contentDiv}>
                            {this.props.notification.message}
                        </div>
                        {this.errors()}
                    </DialogContent>
                    <DialogActions className={classes.actions}>
                        {this.actions()}
                    </DialogActions>
                </Dialog>
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
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotifierDialog);
