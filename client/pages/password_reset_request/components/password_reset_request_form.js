import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { required, isEmail } from '../../../tools/validator';
import { renderInput } from '../../../components/form_inputs';


class PasswordResetRequestForm extends React.Component {
    render() {
        const {
            handleSubmit,
            invalid,
            submitting,
            error,
            requestPasswordChange,
        } = this.props;

        if (error) {
            return (
                <div>{error.messageKey}</div>
            );
        }
        return (
            <form
                name="password_reset_form"
                onSubmit={handleSubmit(requestPasswordChange)}
            >
                <div className="form_input">
                    <Field
                        name="username"
                        type="e-mail"
                        id="outlined-email"
                        label="Email"
                        placeholder="e-mail"
                        component={renderInput}
                        validate={[required, isEmail]}
                        autoFocus
                        variant="outlined"
                    />
                </div>
                <div className="form_input">
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        disabled={submitting || invalid}
                        name="_submit"
                        type="submit"
                    >
                        Reset password
                    </Button>
                </div>
            </form>
        );
    }
}

PasswordResetRequestForm.propTypes = {
    error: PropTypes.object,
    requestPasswordChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
};

export default reduxForm({
    form: 'PasswordResetRequestForm',
})(PasswordResetRequestForm);
