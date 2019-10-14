import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withCookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import styles from '../styles';

class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
        };
    }

    componentDidMount() {
        this.setStatus();
    }

    componentDidUpdate(prevProps) {
        if (this.props.allCookies !== prevProps.allCookies) {
            this.setStatus();
        }
    }

    setStatus = () => {
        const { allCookies } = this.props;
        if (allCookies.session) {
            this.setState({
                username: allCookies.session.username,
            });
        } else {
            this.setState({
                username: null,
            });
        }
    }

    render() {
        const { isOnline, classes } = this.props;
        const linkAuth = () => {
            if (this.state.username != null) {
                return (
                    <div className={classes.signer}>
                        <ButtonBase className={classes.welcome}>
                            <span>Welcome</span>
                            <span className={classes.statusUser}>{this.state.username}</span>
                        </ButtonBase>
                        {
                            isOnline ? (
                                <ButtonBase
                                    component={Link}
                                    to="/logout"
                                >
                                    Log out
                                </ButtonBase>
                            ) :
                                null
                        }
                    </div>
                );
            }
            return (
                <div className={classes.signer}>
                    <ButtonBase
                        component={Link}
                        to="/login"
                    >
                            Login
                    </ButtonBase>
                    <ButtonBase
                        component={Link}
                        to="/registration"
                    >
                            Register
                    </ButtonBase>
                </div>
            );
        };

        return (
            <div className={classes.root}>
                { linkAuth() }
            </div>
        );
    }
}

Status.propTypes = {
    allCookies: PropTypes.object.isRequired,
    isOnline: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        login: state.login,
        checkSession: state.checkSession,
        socialLoginGoogle: state.socialLoginGoogle,
        isOnline: state.status.isOnline,
        insertSocialRegisterSupp: state.insertSocialRegisterSupp,
    };
};

export default withCookies(connect(mapStateToProps)(withStyles(styles)(Status)));
