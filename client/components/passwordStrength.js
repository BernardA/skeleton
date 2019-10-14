import React from 'react';
import Check from '@material-ui/icons/CheckCircleOutline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = {
    passwordReq: {
        textAlign: 'initial',
        '& p': {
            display: 'flex',
        },
    },
};

class PasswordStrength extends React.Component {
    componentDidUpdate(prevProps) {
        const { plainPassword } = this.props;
        if (prevProps.plainPassword !== plainPassword) {
            const reg1 = /^(?=.*[a-z])(?=.*[A-Z])/;
            const reg2 = /^(?=.*[0-9])/;
            const reg3 = /^(?=.*[!@#$%^&*])/;
            const reg4 = /^(?=.{10,})/;
            const letters = document.getElementById('letters');
            const numbers = document.getElementById('numbers');
            const symbols = document.getElementById('symbols');
            const length = document.getElementById('length');
            if (letters) {
                if (reg1.test(plainPassword)) {
                    letters.classList.add('passwordOk');
                } else {
                    letters.classList.remove('passwordOk');
                }
                if (reg2.test(plainPassword)) {
                    numbers.classList.add('passwordOk');
                } else {
                    numbers.classList.remove('passwordOk');
                }
                if (reg3.test(plainPassword)) {
                    symbols.classList.add('passwordOk');
                } else {
                    symbols.classList.remove('passwordOk');
                }
                if (reg4.test(plainPassword)) {
                    length.classList.add('passwordOk');
                } else {
                    length.classList.remove('passwordOk');
                }
            }
        }
    }

    render() {
        const { classes, plainPassword, isActivePlainPassword } = this.props;
        if (plainPassword && isActivePlainPassword) {
            return (
                <div className={classes.passwordReq}>
                    Password requirements:
                    <p>
                        <Check id="letters" />
                        <span>At least one small and one capital letter</span>
                    </p>
                    <p>
                        <Check id="numbers" />
                        <span>At least one number</span>
                    </p>
                    <p>
                        <Check id="symbols" />
                        <span>At least one symbol from !@#$%^&* </span>
                    </p>
                    <p>
                        <Check id="length" />
                        <span>Between 10 and 50 characters </span>
                    </p>
                </div>
            );
        }
        return null;
    }
}

PasswordStrength.propTypes = {
    plainPassword: PropTypes.any,
    isActivePlainPassword: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PasswordStrength);
