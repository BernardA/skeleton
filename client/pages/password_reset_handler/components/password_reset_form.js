import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { required, minLength, isMatchPassword } from '../../../tools/validator';
import { renderInput } from '../../../components/form_inputs';

const minLength8 = minLength(8);
const match = ['fos_user_resetting_form', 'plainPassword', 'first'];
const isMatchplainPasswordFirst = isMatchPassword(match);

const PasswordResetForm = (props) => {
    const {
        handleSubmit,
        submitting,
        invalid,
        onSubmitPasswordResetForm,
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
                    type="password"
                    id="fos_user_resetting_form_plainPassword_first"
                    placeholder="new password"
                    component={renderInput}
                    autoComplete="off"
                    validate={[required, minLength8]}
                />
            </div>
            <div className="form_input">
                <Field
                    name="fos_user_resetting_form[plainPassword][second]"
                    type="password"
                    id="fos_user_resetting_form_plainPassword_second"
                    placeholder="new password confirmation"
                    component={renderInput}
                    validate={[required, isMatchplainPasswordFirst]}
                />
            </div>
            <div>
                <Button
                    variant="outlined"
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
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    onSubmitPasswordResetForm: PropTypes.func.isRequired,
};

export default reduxForm({
    form: 'PasswordResetForm',
})(PasswordResetForm);
