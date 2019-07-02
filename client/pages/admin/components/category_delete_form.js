import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { required } from '../../../tools/validator';
import RenderSelect from '../../../components/render_select';


const styles = theme => ({
    button: {
      margin: theme.spacing(1),
    },
    item: {
        marginLeft: '30px',
    },
    group: {
        fontWeight: theme.typography.fontWeightMedium,
        opacity: 0.5,
        pointerEvent: 'none',
    },
  });

const CategoryDeleteForm = (props) => {
    
    useEffect(() => {
        props.isClearDeleteCategoryForm ? props.reset() : false
    });

    const { 
        classes,
        handleSubmit,
        submitCatDelete, 
        invalid, 
        submitting, 
        error,
        categories,
    } = props;

    const catOptions = (type) => {
        return categories[type].map((row) => {
            const category = Object.keys(row)[0];
            return (
                <MenuItem
                    key={type + category}
                    className={classes.item}
                    value={`${type}-${category}`}
                >
                    {category}
                </MenuItem>
            )
        })
    }
    
    if(error){
        return (
            <div>{ error.messageKey}</div>
        )
    }else {
        return (
            <form 
                name="category_delete_form"
                onSubmit={handleSubmit(submitCatDelete)}
            >

                <div className="form_input">
                    <Field 
                        name="title"
                        id="title"  
                        component={RenderSelect}
                        validate={[required]}
                    >
                        <MenuItem value=''> Select category </MenuItem>
                        <MenuItem className={classes.group}>{Object.keys(categories)[0]}</MenuItem>
                        {catOptions(Object.keys(categories)[0])}
                        <MenuItem className={classes.group}>{Object.keys(categories)[1]}</MenuItem>
                        {catOptions(Object.keys(categories)[1])}
                    </Field>
                </div>
                <div className="form_input">
                    <Button 
                        className={classes.button}
                        variant="outlined"
                        color="primary"
                        type="submit" 
                        disabled={submitting || invalid}
                    >
                        Submit
                    </Button>
                </div>
            </form>     
        )  
    }
}

CategoryDeleteForm.propTypes = {
    error: PropTypes.object
};

export default reduxForm({
    form: 'CategoryDeleteForm'
})(withStyles(styles)(CategoryDeleteForm));
