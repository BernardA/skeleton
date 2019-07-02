import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
});

const ImageUploadForm = (props) => {
    const {
        classes,
        uploadErrors,
        handleImageUploadFormSubmit,
        handleFileSelected,
        handleDeleteFileSelected,
    } = props;
    const errors = uploadErrors.map((error, index) => {
        return (
            <li key={index}>
                {error}
            </li>
        );
    });

    return (
        <form onSubmit={handleImageUploadFormSubmit}>
            <div id="file_select">
                <label
                    htmlFor="imgFile"
                    id="imgFile_label"
                >
                    <Button
                        variant="outlined"
                        className={`${classes.button}, no_click`}
                        color="primary"
                    >
                        Add/change image
                    </Button>
                </label>
                <input
                    name="form[imgFile]"
                    type="file"
                    id="imgFile"
                    onChange={handleFileSelected}
                />
            </div>
            <div id="file_holder" className="no_show">
                <div className="flex">
                    <p id="selected_file" />
                    <ButtonBase
                        id="delete_file"
                        className="icon_container"
                        onClick={handleDeleteFileSelected}
                    >
                        <DeleteOutlinedIcon className="no_click" />
                    </ButtonBase>
                </div>
            </div>
            <div>
                <ul>{errors}</ul>
            </div>
            <div id="file_submit" className="no_show">
                <Button
                    className={classes.button}
                    name="form[save]"
                    variant="outlined"
                    color="primary"
                    type="submit"
                >
                    Upload
                </Button>
            </div>
        </form>
    );
};

ImageUploadForm.propTypes = {
    classes: PropTypes.object.isRequired,
    uploadErrors: PropTypes.func.isRequired,
    handleFileSelected: PropTypes.func.isRequired,
    handleDeleteFileSelected: PropTypes.func.isRequired,
    handleImageUploadFormSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(ImageUploadForm);
