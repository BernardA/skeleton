import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { required, maxLength, minValue } from '../../../tools/validator';
import { renderInput } from '../../../components/form_inputs';

// validation like maxLength(n) will cause errors as per https://github.com/erikras/redux-form/issues/4017#issuecomment-386788539
// so get assignment of n off render as follows

const maxLength180 = maxLength(180);
const minValue1 = minValue(1);
const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

class AddressChangeForm extends React.Component {
    render() {
        const {
            classes,
            handleSubmit,
            invalid,
            submitting,
            error,
            pristine,
            reset,
            handleSubmitAddressChange,
        } = this.props;
        if (error) {
            return (
                <div>{ error.messageKey}</div>
            );
        }
        return (
            <form
                name="address_form"
                onSubmit={handleSubmit(handleSubmitAddressChange)}
            >
                <div className="form_input">
                    <Field
                        name="address_form[address1]"
                        type="text"
                        id="address1"
                        placeholder="Street number"
                        component={renderInput}
                        validate={[required, minValue1]}
                        autoFocus
                        variant="outlined"
                        label="Street number"
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address_form[address2]"
                        type="text"
                        id="address2"
                        placeholder="Street"
                        component={renderInput}
                        validate={[required, maxLength180]}
                        variant="outlined"
                        label="Street"
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address_form[address3]"
                        type="text"
                        id="address3"
                        placeholder="Complement"
                        component={renderInput}
                        variant="outlined"
                        label="Complement"
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address_form[city]"
                        type="text"
                        id="city"
                        placeholder="City"
                        component={renderInput}
                        validate={[required]}
                        variant="outlined"
                        label="City"
                    />
                </div>
                <div className="form_input">
                    <Field
                        name="address_form[postalCode]"
                        type="text"
                        id="postal_code"
                        placeholder="Postal code"
                        component={renderInput}
                        validate={[required]}
                        variant="outlined"
                        label="Postal code"
                    />
                </div>
                <div className="form_input form_submit">
                    <FormGroup
                        row
                    >
                        <Button
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            type="submit"
                            disabled={submitting || invalid}
                        >
                            Submit
                        </Button>
                        <Button
                            disabled={pristine || submitting}
                            onClick={reset}
                            variant="outlined"
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

AddressChangeForm.propTypes = {
    error: PropTypes.object,
    handleSubmitAddressChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
};


export default reduxForm({
    form: 'AddressChangeForm',
})(withStyles(styles)(AddressChangeForm));
