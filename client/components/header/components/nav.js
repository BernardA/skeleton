import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { MenuList, MenuItem } from '@material-ui/core';
import { withCookies, Cookies } from 'react-cookie';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import styles from '../styles';


class Nav extends React.Component {
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.state = {
            session: cookies.get('session') || false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.allCookies !== prevProps.allCookies) {
            if (this.props.allCookies.session) {
                this.setState({
                    session: this.props.cookies.get('session'),
                });
            } else {
                this.setState({
                    session: null,
                });
            }
        }
    }

    render() {
        const { classes } = this.props;
        const isAdmin = () => {
            if (this.state.session && this.state.session.is_admin) {
                return (
                    <NavLink to="/admin" isActive={match => (!!match)}>
                        <MenuItem disableGutters>
                            Admin
                        </MenuItem>
                    </NavLink>

                );
            }
            return null;
        };

        const isActive = (match, location) => {
            if (!match) {
                if (location.pathname.includes('mailbox')) {
                    return true;
                }
                return false;
            }
            return true;
        };

        return (
            <MenuList className={classes.nav}>
                <NavLink exact to="/" isActive={match => (!!match)}>
                    <MenuItem disableGutters>
                        Home
                    </MenuItem>
                </NavLink>
                <NavLink to="/search" isActive={match => (!!match)}>
                    <MenuItem disableGutters>
                        Search
                    </MenuItem>
                </NavLink>
                <NavLink to="/account" isActive={match => !!match}>
                    <MenuItem disableGutters>
                        Account
                    </MenuItem>
                </NavLink>
                <NavLink to="/mailbox/inbox" isActive={isActive}>
                    <MenuItem disableGutters>
                        Mailbox
                    </MenuItem>
                </NavLink>
                {isAdmin()}
            </MenuList>
        );
    }
}

Nav.propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    allCookies: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        login: state.login,
        checkSession: state.checkSession,
    };
};

export default withCookies(withRouter(connect(mapStateToProps)(withStyles(styles)(Nav))));
