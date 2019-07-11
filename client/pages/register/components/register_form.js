import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import {
    required, minLength, maxLength, isEmail, isMatchPassword, rgpd, isSpace,
} from '../../../tools/validator';
import { renderInput, renderCheckBox, renderPassword } from '../../../components/form_inputs';
import styles from '../styles';

// validation like maxLength(n) will cause errors as per https://github.com/erikras/redux-form/issues/4017#issuecomment-386788539
// so get assignment of n off render as follows

const maxLength180 = maxLength(180);
const minLength8 = minLength(8);
const match = ['fos_user_registration_form', 'plainPassword', 'first'];
const isMatchPlainPasswordFirst = isMatchPassword(match);


class RegisterForm extends React.Component {
    render() {
        const {
            classes,
            handleSubmit,
            submitting,
            invalid,
            error,
            reset,
            pristine,
            submitRegister,
            handleToggleVisiblePassword,
            isPasswordMasked,
        } = this.props;

        if (error) {
            return (
                <div>{ error.messageKey}</div>
            );
        }
        return (
            <form
                name="fos_user_registration_form"
                onSubmit={handleSubmit(submitRegister)}
            >
                <div className="form_input">
                    <Field
                        name="fos_user_registration_form[email]"
                        type="e-mail"
                        id="outlined-email"
                        label="Email"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, isEmail]}
                        autoFocus
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="fos_user_registration_form[username]"
                        type="text"
                        id="outlined-username"
                        label="Username"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, maxLength180]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="fos_user_registration_form[plainPassword][first]"
                        type={isPasswordMasked ? 'password' : 'text'}
                        id="outlined-password"
                        label="Password"
                        variant="outlined"
                        component={renderPassword}
                        validate={[required, minLength8, isSpace]}
                        handleToggleVisiblePassword={handleToggleVisiblePassword}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="fos_user_registration_form[plainPassword][second]"
                        type={isPasswordMasked ? 'password' : 'text'}
                        id="outlined-password_confirmation"
                        label="Password confirmation"
                        variant="outlined"
                        component={renderPassword}
                        validate={[required, isSpace, isMatchPlainPasswordFirst]}
                        handleToggleVisiblePassword={handleToggleVisiblePassword}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address1"
                        type="text"
                        id="outlined-address1"
                        label="Street number"
                        variant="outlined"
                        component={renderInput}
                        validate={[required]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address2"
                        type="text"
                        id="outlined-address2"
                        label="Street"
                        variant="outlined"
                        component={renderInput}
                        validate={[required, maxLength180]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address3"
                        type="text"
                        id="address3"
                        label="Complement of address"
                        variant="outlined"
                        component={renderInput}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="city"
                        type="text"
                        id="outlined-city"
                        label="City"
                        variant="outlined"
                        component={renderInput}
                        validate={[required]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="postal_code"
                        type="text"
                        id="postal_code"
                        label="Postal code"
                        variant="outlined"
                        component={renderInput}
                        validate={[required]}
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="fos_user_registration_form[rgpd]"
                        type="checkbox"
                        value="on"
                        text="Acceptation RGPD"
                        component={renderCheckBox}
                        validate={rgpd}
                    />
                    <div>
                        <Typography
                            variant="body2"
                            color="inherit"
                            className={classes.body2}
                            align="justify"
                        >
                            Je certifie avoir l`&apos;`âge légal, avoir lu et accepté la
                            <Link to="/mentions-legales">
                                Politique de confidentialité
                            </Link>
                            de monsite.fr.
                        </Typography>
                    </div>
                </div>
                <div id="captcha_signup" />
                <div className="form_input form_submit">
                    <FormGroup row>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={submitting || invalid}
                            name="_submit"
                            type="submit"
                        >
                            Register
                        </Button>
                        <Button
                            className={classes.button}
                            disabled={pristine || submitting}
                            onClick={reset}
                            variant="contained"
                            color="primary"
                        >
                            Clear
                        </Button>
                    </FormGroup>
                </div>
            </form>
        );
    }
}

RegisterForm.propTypes = {
    error: PropTypes.any,
    submitRegister: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleToggleVisiblePassword: PropTypes.func.isRequired,
    isPasswordMasked: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
};

const decorated = withStyles(styles)(RegisterForm);

export default reduxForm({
    form: 'RegisterForm',
})(decorated);
