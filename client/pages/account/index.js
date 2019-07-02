import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import ImageUploadForm from './components/image_upload_form';
import Profile from './components/profile';

import { LoadingVisibility } from '../../components/loading';
import {
    AVATAR_ACCEPTED_MIME_TYPES,
    UPLOAD_MAX_SIZE,
} from '../../parameters';

import { extractImageFileExtensionFromBase64 } from '../../tools/functions';
import { actionUploadImage, actionChangeAddress } from '../../store/actions';


const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.imagePreviewCanvasRef = React.createRef();
        this.state = {
            username: null,
            selectedFile: null,
            selectedFileMimeType: null,
            selectedFileName: null,
            imageUploadResponse: [],
            uploadErrors: [],
            getProfileResponse: {},
            isActiveChangeAddressForm: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        console.log('account props', this.props);
        let username = null;
        if (this.props.checkSession.data) {
            username = { username: this.props.checkSession.data.username };
        }

        if (!username) {
            localforage.getItem('bda_session').then((value) => {
                console.log('localforage.getItem', value);
                if (value) {
                    this.setState({ username: value.username });
                }
            });
        }

        const setStates = (data) => {
            this.setState({
                getProfileResponse: data,
                username: data.username,
            });
        };
        if (this.props.user_data_for_offline.data) {
            setStates(this.props.user_data_for_offline.data.profile);
        } else {
            // data is not in state => check if in indexeddb
            localforage.getItem('profile').then((value) => {
                if (value != null) {
                    console.log('profile data from indexeddb');
                    setStates(value);
                } else {
                    // get all user data from remote
                    const getUserData = new CustomEvent('get_user_data', {
                        detail: {
                            username: username.username,
                        },
                    });
                    window.dispatchEvent(getUserData);
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        console.log('update account props', this.props);
        // capture user data from dispatched getUserData below
        if (prevProps.user_data_for_offline !== this.props.user_data_for_offline) {
            const data = this.props.user_data_for_offline.data.profile;
            this.setState({
                getProfileResponse: data,
                username: data.username,
            });
        }
    }

    handleFileSelected = (event) => {
        const file = event.target.files[0];
        const errors = [];
        if (!AVATAR_ACCEPTED_MIME_TYPES.includes(file.type)) {
            errors.push('Invalid file type. Only jpeg and png accepted');
        }
        if (file.size > UPLOAD_MAX_SIZE) {
            errors.push('File size is bigger than allowed( 2MB )');
        }
        this.setState({ uploadErrors: errors });
        if (errors.length === 0) {
            const filename = file.name.split('.')[0];
            const myFileReader = new FileReader();
            myFileReader.addEventListener('load', () => {
                const img = new Image();
                img.src = myFileReader.result;
                img.onload = () => {
                    this.setState({
                        selectedFile: myFileReader.result,
                        selectedFileMimeType: file.type,
                        selectedFileName: filename,
                    });
                };
            }, false);
            myFileReader.readAsDataURL(file);

            document.getElementById('selected_file').innerHTML = file.name;
            document.getElementById('file_holder').classList.remove('no_show');
            document.getElementById('file_submit').classList.remove('no_show');
            document.getElementById('file_select').classList.add('no_show');
        }
    }

    handleDeleteFileSelected = () => {
        this.setState({
            selectedFile: null,
            selectedFileMimeType: null,
            selectedFileName: null,
        });
        document.getElementById('selected_file').innerHTML = '';
        document.getElementById('file_holder').classList.add('no_show');
        document.getElementById('file_submit').classList.add('no_show');
        document.getElementById('file_select').classList.remove('no_show');
    }


    handleImageUploadFormSubmit = (event) => {
        event.preventDefault();
        this.setState({ imageUploadResponse: {} });
        const fileExtension = extractImageFileExtensionFromBase64(this.state.selectedFile);
        const filename = `${this.state.selectedFileName}.${fileExtension}`;
        const formData = new FormData();
        formData.append('form[imgFile]', filename);
        const submitForm = new Promise((resolve) => {
            resolve(this.props.actionUploadImage(formData));
        });

        submitForm.then((result) => {
            this.setState({ imageUploadResponse: result.payload.data });
            if (result.payload.data.status === 'ok') {
                // dispatch event to get user data from header component
                const username = { username: this.state.username };
                const getUserData = new CustomEvent('get_user_data', {
                    detail: {
                        username,
                    },
                });
                window.dispatchEvent(getUserData);
                this.handleDeleteFileSelected();
            } else {
                this.setState({
                    notification: {
                        status: 'error',
                        title: 'Unknown error',
                        message: 'Please try again',
                        errors: {},
                    },
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    handleSubmitAddressChange = () => {
        const values = this.props.address_change_form.values.address_form;

        const submitAddressChangeForm = new Promise((resolve) => {
            resolve(this.props.actionChangeAddress(values));
        });
        submitAddressChangeForm.then((result) => {
            if (result.payload.data.status === 'ok') {
                this.setState({
                    getProfileResponse: result.payload.data.profile,
                    isActiveChangeAddressForm: false,
                    notification: {
                        status: 'ok_and_dismiss',
                        title: 'Success.',
                        message: 'Your changes were processed.',
                        errors: {},
                    },
                });
            } else {
                this.setState({
                    notification: {
                        status: 'error',
                        title: 'Error',
                        message: 'Please correct errors below.',
                        errors: result.payload.data.errors,
                    },
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    toggleAddressChangeForm = () => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        this.setState({ isActiveChangeAddressForm: !this.state.isActiveChangeAddressForm });
    }

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }


    render() {
        console.log('account state', this.state);
        console.log('canvas ref', this.imagePreviewCanvasRef.current);

        return (
            <React.Fragment>
                <main id="account">
                    <h1> Hello World from Account! </h1>
                    {
                        this.props.online_status.isOnline ? (
                            <div className="flex">
                                <Button component={Link} to="/account/contacts">
                                    Manage contact
                                </Button>
                                <Button component={Link} to="/account/groups/home">
                                    Manage groups
                                </Button>
                            </div>
                        ) :
                            null
                    }
                    <Profile
                        profile={this.state.getProfileResponse}
                        handleSubmitAddressChange={this.handleSubmitAddressChange}
                        toggleAddressChangeForm={this.toggleAddressChangeForm}
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                        isActiveChangeAddressForm={this.state.isActiveChangeAddressForm}
                        onlineStatus={this.props.online_status}
                    />
                    {
                        this.props.online_status.isOnline ? (
                            <React.Fragment>
                                <ImageUploadForm
                                    handleFileSelected={this.handleFileSelected}
                                    handleDeleteFileSelected={this.handleDeleteFileSelected}
                                    handleImageUploadFormSubmit={this.handleImageUploadFormSubmit}
                                    uploadErrors={this.state.uploadErrors}
                                />
                            </React.Fragment>
                        ) :
                            null
                    }
                </main>
                <Footer />
            </React.Fragment>
        );
    }
}

Account.propTypes = {
    checkSession: PropTypes.object.isRequired,
    user_data_for_offline: PropTypes.object.isRequired,
    actionUploadImage: PropTypes.func.isRequired,
    actionChangeAddress: PropTypes.func.isRequired,
    address_change_form: PropTypes.any,
    online_status: PropTypes.object.isRequired,
};


const mapStateToProps = (state) => {
    return {
        address_change_form: state.form.AddressChangeForm,
        user_data_for_offline: state.getUserDataForOffline,
        changeAddress: state.changeAddress,
        login: state.login,
        online_status: state.online_status,
        checkSession: state.checkSession,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionUploadImage,
        actionChangeAddress,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
