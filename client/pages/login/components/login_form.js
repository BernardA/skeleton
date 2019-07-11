import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types';
import {
    required, minLength, isEmail, isSpace,
} from '../../../tools/validator';
import { renderInput, renderCheckBox, renderPassword } from '../../../components/form_inputs';
import styles from '../styles';

const minLength8 = minLength(8);

class LoginForm extends React.Component {
    render() {
        const {
            classes,
            handleSubmit,
            invalid,
            submitting,
            error,
            submitLogin,
            handleToggleVisiblePassword,
            isPasswordMasked,
        } = this.props;
        if (error) {
            return (
                <div>{error.messageKey}</div>
            );
        }
        return (
            <form
                name="login_form"
                onSubmit={handleSubmit(submitLogin)}
            >
                <div className="form_input">
                    <Field
                        name="_username"
                        type="e-mail"
                        id="outlined-email"
                        label="Email"
                        component={renderInput}
                        validate={[required, isEmail]}
                        autoFocus
                        variant="outlined"
                    />
                </div>

                <div className="form_input">
                    <Field
                        name="_password"
                        type={isPasswordMasked ? 'password' : 'text'}
                        id="outlined-password"
                        label="Password"
                        variant="outlined"
                        component={renderPassword}
                        validate={[required, isSpace, minLength8]}
                        handleToggleVisiblePassword={handleToggleVisiblePassword}
                    />
                </div>
                <div id="captcha" />

                <div className="form_input">
                    <FormGroup
                        className={classes.formGroup}
                        row
                    >
                        <Field
                            name="_remember_me"
                            type="checkbox"
                            id="remember_me"
                            text="remember me"
                            component={renderCheckBox}
                        />
                        <Link className={classes.forgotPassword} to="/password-reset-request">forgot password?</Link>
                    </FormGroup>
                </div>
                <Button
                    className={classes.button}
                    variant="contained"
                    fullWidth
                    color="primary"
                    disabled={submitting || invalid}
                    name="_submit"
                    type="submit"
                >
                    Connect
                </Button>
            </form>
        );
    }
}

LoginForm.propTypes = {
    error: PropTypes.any,
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleToggleVisiblePassword: PropTypes.func.isRequired,
    isPasswordMasked: PropTypes.bool.isRequired,
    submitLogin: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

const decorated = withStyles(styles)(LoginForm);

export default reduxForm({
    form: 'LoginForm',
})(decorated);
