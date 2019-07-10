import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withCookies } from 'react-cookie';
import PropTypes from 'prop-types';

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
        const linkAuth = () => {
            if (this.state.username != null) {
                return (
                    <div className="signer flex">
                        <ButtonBase>
                            <span>Welcome</span>
                            <span className="status_user">{this.state.username}</span>
                        </ButtonBase>
                        {
                            this.props.online_status.isOnline ? (
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
                <div className="signer flex">
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
            <div className="status">
                { linkAuth() }
            </div>
        );
    }
}

Status.propTypes = {
    allCookies: PropTypes.object.isRequired,
    online_status: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        login: state.login,
        checkSession: state.checkSession,
        socialLoginGoogle: state.socialLoginGoogle,
        online_status: state.online_status,
        insertSocialRegisterSupp: state.insertSocialRegisterSupp,
    };
};

export default withCookies(connect(mapStateToProps)(Status));
