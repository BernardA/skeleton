import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = () => ({
    root: {
        flexGrow: 1,
        position: 'fixed',
        top: '15%',
        zIndex: 11000,
        width: '100%',
        maxWidth: '1200px',
    },
    header: {
        position: 'static',
        backgroundColor: 'brown',
    },
    grow: {
        flexGrow: 1,
        fontSize: '1.25rem',
        textAlign: 'center',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    toolBar: {
        display: 'grid',
        marginTop: '10px',
    },
    cssRoot: {
        width: '100%',
        textTransform: 'uppercase',
        fontSize: '1rem',
        color: 'yellow',
    },
    buttonContainer: {
        margin: '10px 0',
        width: '100%',
    },
});

function RgpdDialog(props) {
    const { classes, handleCloseRgpdDialog } = props;
    return (
        <div className={classes.root}>
            <AppBar className={classes.header}>
                <Toolbar className={classes.toolBar}>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                        En construction - Work in progress
                    </Typography>
                    <div className={classes.buttonContainer}>
                        <ButtonBase
                            className={classes.cssRoot}
                            onClick={handleCloseRgpdDialog}
                        >
                            Fermer - Close
                        </ButtonBase>
                    </div>

                </Toolbar>
            </AppBar>
        </div>
    );
}

RgpdDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    handleCloseRgpdDialog: PropTypes.func.isRequired,
};

export default withStyles(styles)(RgpdDialog);
