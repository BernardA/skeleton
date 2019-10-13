import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import Img from 'react-webp-image';
import localforage from 'localforage';
import PropTypes from 'prop-types';
import Status from './components/status';
import Nav from './components/nav';
import SessionHandler from '../session_handler';
import NotifierDialog from '../notifier_dialog';
import {
    actionGetInitialDataForOffline,
    actionGetUserDataForOffline,
} from '../../store/actions';
import { MAIN_LOGO_PATH_PNG, MAIN_LOGO_PATH_WEBP } from '../../parameters';
import RgpdDialog from '../rgpd_dialog';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRgpd: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }


    componentDidMount() {
        // this.getGeo(); //DISABLED TO AVOID CHARGES/KEEP PARIS AS DEFAULT

        // check if is online and initial data exists in indexeddb, if not fetch it
        if (this.props.isOnline) {
            localforage.getItem('ads').then((value) => {
                if (value === null) {
                    this.getInitialDataForOffline();
                }
            });
        }
        window.addEventListener('get_user_data', (event) => {
            this.getUserDataForOffline(event.detail.username);
        });
        window.addEventListener('get_initial_data', () => {
            this.getInitialDataForOffline();
        });
        this.setIsRgpd();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            this.setIsRgpd();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('get_user_data', this.getUserDataForOffline);
        window.removeEventListener('get_initial_data', this.getInitialDataForOffline);
    }

    setIsRgpd = () => {
        const isRgpdRoute = ['/', '/search'];
        localforage.getItem('isRgpd').then((value) => {
            if (!value) { // if no value in indexeddb proceed to check the route
                if (isRgpdRoute.includes(this.props.location.pathname)) {
                    this.setState({ isRgpd: true });
                } else {
                    this.setState({ isRgpd: false });
                }
            } else { // if isRgpd is set on indexeddb, do not show dialog
                this.setState({ isRgpd: false });
            }
        });
    }

    handleCloseRgpdDialog = () => {
        this.setState({ isRgpd: false });
        localforage.setItem('isRgpd', true);
    }

    getInitialDataForOffline = () => {
        this.props.actionGetInitialDataForOffline();
    }

    getUserDataForOffline = (username) => {
        this.props.actionGetUserDataForOffline(username);
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
    }

    render() {
        const { location } = this.props;
        return (
            <React.Fragment>
                {
                    this.state.isRgpd ?
                        <RgpdDialog handleCloseRgpdDialog={this.handleCloseRgpdDialog} />
                        :
                        null
                }
                <header>
                    <div className="header_top grid">
                        <ButtonBase
                            className="branding"
                            component={Link}
                            to="/"
                        >
                            <Img
                                src={MAIN_LOGO_PATH_PNG}
                                webp={MAIN_LOGO_PATH_WEBP}
                                alt="logo"
                            />
                        </ButtonBase>
                        <Status />
                    </div>
                    <Nav />
                    <div className="auth">
                        <SessionHandler location={location} />
                    </div>
                    <NotifierDialog
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                    />
                </header>
            </React.Fragment>
        );
    }
}

Header.propTypes = {
    location: PropTypes.object.isRequired,
    isOnline: PropTypes.bool.isRequired,
    actionGetInitialDataForOffline: PropTypes.func.isRequired,
    actionGetUserDataForOffline: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    return {
        errorOfflineUser: state.status,
        dataOfflineUser: state.status,
        errorOfflineInitial: state.status,
        dataOfflineInitial: state.status,
        showMap: state.showMap,
        getGeoInfo: state.getGeoInfo,
        isOnline: state.status.isOnline,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionGetInitialDataForOffline,
        actionGetUserDataForOffline,
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
