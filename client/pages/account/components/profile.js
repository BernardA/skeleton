import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import AddressChangeForm from './address_change_form';
import NotifierDialog from '../../../components/notifier_dialog';
import NotifierInline from '../../../components/notifier_inline';


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

const Profile = (props) => {
    console.log('profile props', props);
    const {
        classes,
        profile,
        isActiveChangeAddressForm,
        onlineStatus,
        toggleAddressChangeForm,
        handleSubmitAddressChange,
        handleNotificationDismiss,
        notification,
    } = props;
    if (Object.keys(profile).length > 0) {
        return (
            <React.Fragment>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    Username
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                >
                                    {profile.username}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    E-mail
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                >
                                    {profile.email}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    Street
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                >
                                    {`${profile.address.address1}, ${
                                        profile.address.address2
                                    }`}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    Complement
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                >
                                    {profile.address.address3}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    City
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                >
                                    {profile.address.city}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    gutterBottom
                                >
                                    Postal code
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                >
                                    {profile.address.postal_code}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {onlineStatus.isOnline ? (
                    <div>
                        <Button
                            id="address_change"
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            onClick={toggleAddressChangeForm}
                        >
                            Change address
                        </Button>
                        <div>
                            {isActiveChangeAddressForm ? (
                                <React.Fragment>
                                    <AddressChangeForm
                                        handleSubmitAddressChange={
                                            handleSubmitAddressChange
                                        }
                                        username={profile.username}
                                    />
                                </React.Fragment>
                            ) : null}
                            <div>
                                <NotifierDialog
                                    notification={notification}
                                    handleNotificationDismiss={
                                        handleNotificationDismiss
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <NotifierInline message="You seem to be offline. Profile changes are disabled." />
                )}
            </React.Fragment>
        );
    }
    return null;
};

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
    isActiveChangeAddressForm: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
    onlineStatus: PropTypes.object.isRequired,
    toggleAddressChangeForm: PropTypes.func.isRequired,
    handleSubmitAddressChange: PropTypes.func.isRequired,
    handleNotificationDismiss: PropTypes.func.isRequired,
    notification: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
