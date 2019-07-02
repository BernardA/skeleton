import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import {
    onlineStatus,
    checkSession,
    getInitialDataForOffline,
    getUserDataForOffline,
    login,
    register,
    insertAddress,
    uploadImage,
    changeAddress,
    submitPasswordResetToken,
    changePassword,
    requestPasswordChange,
} from './reducers';

const rootReducer = combineReducers({
    form: formReducer,
    checkSession,
    getInitialDataForOffline,
    getUserDataForOffline,
    online_status: onlineStatus,
    insertAddress,
    changeAddress,
    login,
    changePassword,
    requestPasswordChange,
    submitPasswordResetToken,
    register,
    uploadImage,
});

export default rootReducer;
