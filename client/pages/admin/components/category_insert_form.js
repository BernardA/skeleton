import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import { required, minLength, maxLength } from '../../../tools/validator';
import { renderInput } from '../../../components/form_inputs';
import RenderSelect from '../../../components/render_select';



const minLength4 = minLength(4);
const maxLength300 = maxLength(300)
const styles = theme => ({
    button: {
      margin: theme.spacing(1),
    },
    item: {
        marginLeft: '30px',
    },
    group: {
        fontWeight: theme.typography.fontWeightMedium,
        opacity: 0.8,
    },
  });

const CategoryInsertForm = (props) => {
    console.log('category insert form', props);
    useEffect(() => {
        props.isClearInsertCategoryForm ? props.reset() : false
    });
    
    const { 
        classes,
        handleSubmit, 
        submitCatInsert,
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
                name="category_insert_form"
                onSubmit={handleSubmit(submitCatInsert)}
            >
                <div className="form_input">
                    <Field 
                        name="title"
                        type="text"
                        id="title"
                        placeholder='description'
                        component={renderInput} 
                        validate={[required, minLength4, maxLength300]}
                    />
                </div>

                <div className="form_input">
                    <Field 
                        name="parent"
                        id="parent"  
                        type="select"
                        label="Category"
                        variant="outlined"
                        component={RenderSelect}
                        validate={[required]}
                    >
                        <MenuItem value=''> Select parent</MenuItem>
                        <MenuItem className={classes.group} value={Object.keys(categories)[0]} >{Object.keys(categories)[0]}</MenuItem>
                        {catOptions(Object.keys(categories)[0])}
                        <MenuItem className={classes.group} value={Object.keys(categories)[1]} >{Object.keys(categories)[1]}</MenuItem>
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

CategoryInsertForm.propTypes = {
    error: PropTypes.object
};

export default reduxForm({
    form: 'CategoryInsertForm'
})(withStyles(styles)(CategoryInsertForm));