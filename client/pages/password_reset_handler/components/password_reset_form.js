import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import {
    required, minLength, isMatchPassword, isSpace,
} from '../../../tools/validator';
import { renderPassword } from '../../../components/form_inputs';

const minLength8 = minLength(8);
const match = ['fos_user_resetting_form', 'plainPassword', 'first'];
const isMatchplainPasswordFirst = isMatchPassword(match);

const PasswordResetForm = (props) => {
    const {
        handleSubmit,
        submitting,
        invalid,
        onSubmitPasswordResetForm,
        handleToggleVisiblePassword,
        isPasswordMasked,
    } = props;

    if (props.error) {
        return (
            <div>{ props.error.messageKey}</div>
        );
    }
    return (
        <form
            id="fos_user_resetting_form"
            name="fos_user_resetting_form"
            onSubmit={handleSubmit(onSubmitPasswordResetForm)}
        >
            <div className="form_input">
                <Field
                    name="fos_user_resetting_form[plainPassword][first]"
                    type={isPasswordMasked ? 'password' : 'text'}
                    id="fos_user_resetting_form_plainPassword_first"
                    label="new password"
                    variant="outlined"
                    component={renderPassword}
                    autoComplete="off"
                    validate={[required, minLength8, isSpace]}
                    handleToggleVisiblePassword={handleToggleVisiblePassword}
                />
            </div>
            <div className="form_input">
                <Field
                    name="fos_user_resetting_form[plainPassword][second]"
                    type={isPasswordMasked ? 'password' : 'text'}
                    id="fos_user_resetting_form_plainPassword_second"
                    variant="outlined"
                    label="new password confirmation"
                    component={renderPassword}
                    validate={[required, isSpace, isMatchplainPasswordFirst]}
                    handleToggleVisiblePassword={handleToggleVisiblePassword}
                />
            </div>
            <div>
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    disabled={submitting || invalid}
                    name="_submit"
                    type="submit"
                >
                    Submit
                </Button>
            </div>
        </form>
    );
};

PasswordResetForm.propTypes = {
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleToggleVisiblePassword: PropTypes.func.isRequired,
    isPasswordMasked: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    onSubmitPasswordResetForm: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'PasswordResetForm',
})(PasswordResetForm);
