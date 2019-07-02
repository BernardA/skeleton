import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';


class NotifierInline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: true,
        };
    }

    handleClose = () => {
        this.setState({ isActive: false });
    }

    render() {
        if (this.state.isActive) {
            return (
                <AppBar position="static" color="primary">
                    <Toolbar className="notifier">
                        <Typography variant="h6" color="inherit">
                            {this.props.message}
                        </Typography>
                        <Fab
                            color="primary"
                            size="small"
                            onClick={this.handleClose}
                            aria-label="Close"
                        >
                            <CloseIcon />
                        </Fab>
                    </Toolbar>
                </AppBar>
            );
        }
        return null;
    }
}

NotifierInline.propTypes = {
    message: PropTypes.string.isRequired,
};

export default NotifierInline;
