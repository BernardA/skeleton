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
        const { dataOfflineUser, dataSession } = this.props;
        let username = null;
        if (dataSession) {
            username = { username: dataSession.username };
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
                username: data.username,
            });
        };
        if (dataOfflineUser) {
            setStates(dataOfflineUser.profile);
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
        const {
            dataOfflineUser,
            dataUpload,
            errorUpload,
            errorAddress,
            dataAddress,
        } = this.props;
        // capture user data from dispatched getUserData below
        if (!prevProps.dataOfflineUser && dataOfflineUser) {
            this.setState({
                username: dataOfflineUser.profile.username,
            });
        }
        if (!prevProps.dataUpload && dataUpload) {
            // dispatch event to get user data from header component
            const username = { username: this.state.username };
            const getUserData = new CustomEvent('get_user_data', {
                detail: {
                    username,
                },
            });
            window.dispatchEvent(getUserData);
            this.handleDeleteFileSelected();
        }
        if (!prevProps.errorUpload && errorUpload) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct errors below.',
                    errors: errorUpload,
                },
            });
        }
        if (!prevProps.errorAddress && errorAddress) {
            this.setState({
                notification: {
                    status: 'error',
                    title: 'Error',
                    message: 'Please correct errors below.',
                    errors: errorUpload,
                },
            });
        }
        if (prevProps.dataAddress && dataAddress) {
            this.setState({
                isActiveChangeAddressForm: false,
                notification: {
                    status: 'ok_and_dismiss',
                    title: 'Success.',
                    message: 'Your changes were processed.',
                    errors: {},
                },
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
        const fileExtension = extractImageFileExtensionFromBase64(this.state.selectedFile);
        const filename = `${this.state.selectedFileName}.${fileExtension}`;
        const formData = new FormData();
        formData.append('form[imgFile]', filename);
        this.props.actionUploadImage(formData);
    }

    handleSubmitAddressChange = () => {
        const values = this.props.addressChangeForm.values.address_form;
        this.props.actionChangeAddress(values);
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
        const { isOnline, dataOfflineUser, errorUpload } = this.props;
        return (
            <React.Fragment>
                <main id="account">
                    <h1> Hello World from Account! </h1>
                    {
                        isOnline ? (
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
                        profile={dataOfflineUser.profile}
                        handleSubmitAddressChange={this.handleSubmitAddressChange}
                        toggleAddressChangeForm={this.toggleAddressChangeForm}
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                        isActiveChangeAddressForm={this.state.isActiveChangeAddressForm}
                        onlineStatus={isOnline}
                    />
                    {
                        isOnline ? (
                            <React.Fragment>
                                <ImageUploadForm
                                    handleFileSelected={this.handleFileSelected}
                                    handleDeleteFileSelected={this.handleDeleteFileSelected}
                                    handleImageUploadFormSubmit={this.handleImageUploadFormSubmit}
                                    uploadErrors={errorUpload}
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
    dataSession: PropTypes.any,
    dataOfflineUser: PropTypes.any,
    actionUploadImage: PropTypes.func.isRequired,
    actionChangeAddress: PropTypes.func.isRequired,
    addressChangeForm: PropTypes.any,
    isOnline: PropTypes.bool.isRequired,
    dataUpload: PropTypes.any,
    dataAddress: PropTypes.any,
    errorUpload: PropTypes.any,
    errorAddress: PropTypes.any,
};


const mapStateToProps = (state) => {
    return {
        ...state.account,
        addressChangeForm: state.form.AddressChangeForm,
        dataOfflineUser: state.status.dataOfflineUser,
        isOnline: state.status.isOnline,
        dataSession: state.status.dataSession,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionUploadImage,
        actionChangeAddress,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);
