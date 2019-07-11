/* eslint-disable react/prop-types */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
import { InputAdornment } from '@material-ui/core';

export const renderInput = (field) => {
    const { meta: { touched, error } } = field;
    return (
        <React.Fragment>
            <TextField
                type={field.type}
                id={field.id}
                label={field.label}
                margin="none"
                helperText={field.helperText}
                fullWidth
                onKeyUp={field.onKeyUp}
                className={field.className}
                placeholder={field.placeholder}
                disabled={field.disabled}
                autoFocus={field.autoFocus}
                {...field.input}
                variant={field.variant}
            />
            <span className="form_error">{touched ? error : ''}</span>
        </React.Fragment>
    );
};

export const renderHiddenInput = (field) => {
    return (
        <React.Fragment>
            <input
                type={field.type}
                id={field.id}
                {...field.input}
            />
        </React.Fragment>
    );
};

export const renderTextArea = (field) => {
    console.log('text area field', field);
    const { meta: { touched, error } } = field;
    return (
        <React.Fragment>
            <TextField
                fullWidth
                type={field.type}
                id={field.id}
                margin="none"
                className={field.className}
                label={field.label}
                placeholder={field.placeholder}
                disabled={field.disabled}
                variant={field.variant}
                {...field.input}
                multiline
            />
            <FormHelperText>{field.helperText}</FormHelperText>
            <span className="form_error">{touched ? error : ''}</span>
        </React.Fragment>
    );
};

export const renderSelect = ({
    id,
    input,
    label,
    disabled,
    helperText,
    meta: { touched, error },
    children,
    ...custom
}) => (
    <React.Fragment>
        <FormControl>
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


export class renderRadio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
        };
    }

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    };

    render() {
        const { meta: { touched, error } } = this.props;
        return (
            <React.Fragment>
                <RadioGroup
                    aria-label={this.props.input.name}
                    name={this.props.input.name}
                    row={this.props.row}
                    value={this.state.value}
                    onChange={this.handleChange}
                >
                    {this.props.options.map(o => (
                        <FormControlLabel
                            key={o.id}
                            control={<Radio color="primary" />}
                            label={o.title}
                            labelPlacement="start"
                            type={this.props.type}
                            id={o.id}
                            {...this.props.input}
                            value={o.value}
                            checked={this.props.input.value}
                        />
                    ))}
                </RadioGroup>
                <span className="form_error">{touched ? error : ''}</span>
            </React.Fragment>
        );
    }
}

export const renderCheckBox = (field) => {
    const { meta: { touched, error } } = field;
    console.log('checkbox field', field);
    return (
        <React.Fragment>
            <FormControlLabel
                control={(
                    <Checkbox
                        type={field.type}
                        id={field.id}
                        checked={field.input.value}
                        {...field.input}
                        color="primary"
                    />
                )}
                label={field.text}
            />
            <span className="form_error">{touched ? error : ''}</span>
        </React.Fragment>
    );
};


// this file input in case of need
// for now, using regular <input type="file"
// and handling validation and insert to form value onChange and onSubmit
// from https://gist.github.com/barraponto/c370c17b2499c36a625fe1326c57ab21

const handleChange = handler => ({ target: { files } }) => handler(
    files.length ? { file: files[0], name: files[0].name } : {},
);

export const renderFileInput = ({
    input: {
        onChange, onBlur, value: omitValue, ...inputProps
    },
    meta: omitMeta,
    ...props
}) => (
    <input
        type="file"
        onChange={handleChange(onChange)}
        onBlur={handleChange(onBlur)}
        {...inputProps}
        {...props}
    />
);

export const renderPassword = (field) => {
    const { meta: { touched, error, warning } } = field;
    return (
        <React.Fragment>
            <TextField
                type={field.type}
                id={field.id}
                label={field.label}
                margin="none"
                helperText={field.helperText}
                fullWidth
                onKeyUp={field.onKeyUp}
                className={field.className}
                placeholder={field.placeholder}
                disabled={field.disabled}
                autoFocus={field.autoFocus}
                {...field.input}
                variant={field.variant}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <RemoveRedEye
                                onClick={field.handleToggleVisiblePassword}
                                className="pointer"
                            />
                        </InputAdornment>
                    ),
                }}
            />
            <span className="form_error">{touched ? error : ''}</span>
            <span className="form_warning">{touched ? warning : ''}</span>
        </React.Fragment>
    );
};
