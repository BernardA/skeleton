import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    containerPub300x600: {
        padding: '10px',
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        },
    },
    pub300x600: {
        width: '300px',
        height: '600px',
        backgroundColor: 'pink',
    },
    imgHolder: {
        width: '175px',
        height: '175px',
        [theme.breakpoints.down('xs')]: {
            width: '120px',
            height: '120px',
        },
    },
});

const Pub300x600 = (props) => {
    const { classes } = props;
    return (
        <div className={classes.containerPub300x600}>
            <div className={classes.pub300x600}>
                pub300x600
            </div>
        </div>
    );
};

Pub300x600.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Pub300x600);
