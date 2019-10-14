import React from 'react';
import { connect } from 'react-redux';
import {
    Field,
    reduxForm,
    formValueSelector,
    getFormMeta,
} from 'redux-form';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import {
    required, isSpace, isMatchPassword, passwordReq,
} from '../../../tools/validator';
import { renderPassword } from '../../../components/form_inputs';
import PasswordStrength from '../../../components/passwordStrength';

const match = ['fos_user_resetting_form', 'plainPassword', 'first'];
const isMatchplainPasswordFirst = isMatchPassword(match);

class PasswordResetForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActivePlainPassword: false,
        };
    }

    componentDidUpdate(prevProps) {
        const { fields } = this.props;
        if (prevProps.fields !== fields) {
            let isActivePlainPassword = false;
            if (fields.fos_user_resetting_form &&
                fields.fos_user_resetting_form.plainPassword &&
                fields.fos_user_resetting_form.plainPassword.first.active
            ) {
                isActivePlainPassword = true;
            }
            this.setState({ isActivePlainPassword });
        }
    }

    render() {
        const {
            handleSubmit,
            submitting,
            invalid,
            onSubmitPasswordResetForm,
            handleToggleVisiblePassword,
            isPasswordMasked,
            error,
            plainPassword,
        } = this.props;

        if (error) {
            return (
                <div>{error.messageKey}</div>
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
                        validate={[required, isSpace, passwordReq]}
                        handleToggleVisiblePassword={handleToggleVisiblePassword}
                    />
                    <PasswordStrength
                        plainPassword={plainPassword}
                        isActivePlainPassword={this.state.isActivePlainPassword}
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
                        validate={[required, isMatchplainPasswordFirst]}
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
    }
}

PasswordResetForm.propTypes = {
    error: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleToggleVisiblePassword: PropTypes.func.isRequired,
    isPasswordMasked: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    onSubmitPasswordResetForm: PropTypes.func.isRequired,
    plainPassword: PropTypes.any,
    fields: PropTypes.object.isRequired,
};

const selector = formValueSelector('PasswordResetForm');

export default connect(
    (state) => {
        const plainPassword = selector(state, 'fos_user_resetting_form[plainPassword][first]');
        const fields = getFormMeta('PasswordResetForm')(state);
        return {
            plainPassword,
            fields,
        };
    },
)(reduxForm({
    form: 'PasswordResetForm',
})(PasswordResetForm));
