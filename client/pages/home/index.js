import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import { LoadingVisibility } from '../../components/loading';
import Pub300x600 from '../../components/pub300x600';

const styles = theme => ({
    adForm: {
        margin: '10px',
        borderRadius: '5px',
        width: '350px',
        height: '500px',
        opacity: '.7',
        [theme.breakpoints.down('sm')]: {
            width: '280px',
        },
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            margin: 0,
        },
    },
    content: {
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'center',
    },
    mainSlider: {
        position: 'absolute',
        zIndex: 0,
        top: 0,
        bottom: 0,
        height: 'auto',
        width: '100%',
    },
});

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class Home extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <main id="home_page" className={classes.content}>
                    <div className="main-title">
                        <h1> Hello from home </h1>
                    </div>
                    <Pub300x600 />
                </main>
                <Footer />
            </React.Fragment>
        );
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        isOnline: state.status.isOnline,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home));
