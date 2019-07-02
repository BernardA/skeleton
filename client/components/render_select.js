/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    formControl: {
        minWidth: 120,
        display: 'grid',
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing(1) * 2,
    },
});

class RenderSelect extends React.Component {
    render() {
        const {
            classes,
            id,
            input,
            label,
            disabled,
            helperText,
            meta: { touched, error },
            children,
            ...custom
        } = this.props;

        return (
            <React.Fragment>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor={id}>{label}</InputLabel>
                    <Select
                        id={id}
                        {...input}
                        onChange={value => input.onChange(value)}
                        {...custom}
                    >
                        {children}
                    </Select>

                    <FormHelperText>{helperText}</FormHelperText>
                    <span className="form_error">{touched ? error : ''}</span>
                </FormControl>
            </React.Fragment>
        );
    }
}

RenderSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RenderSelect);

/*
const RenderSelect = ({
    id,
    input,
    label,
    helperText,
    meta: { touched, error },
    children,
    ...custom
  }) => (
        <React.Fragment>
            <FormControl>
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <Select
                    {...input}
                    onChange={( value) => input.onChange(value)}
                    children={children}
                    {...custom}
                />
                <FormHelperText>{helperText}</FormHelperText>
                <span className="form_error">{touched ? error : ''}</span>
            </FormControl>
        </React.Fragment>

  )

  export default RenderSelect;
  */
