export const ONLINE_STATUS = 'ONLINE_STATUS';

export const CHECK_SESSION = 'CHECK_SESSION';
export const CHECK_SESSION_INIT = 'CHECK_SESSION_INIT';
export const CHECK_SESSION_OK = 'CHECK_SESSION_OK';
export const CHECK_SESSION_ERROR = 'CHECK_SESSION_ERROR';

export function actionCheckSession() {
    return {
        type: CHECK_SESSION,
    };
}

export const GET_USER_DATA_FOR_OFFLINE = 'GET_USER_DATA_FOR_OFFLINE';
export const GET_USER_DATA_FOR_OFFLINE_INIT = 'GET_USER_DATA_FOR_OFFLINE_INIT';
export const GET_USER_DATA_FOR_OFFLINE_OK = 'GET_USER_DATA_FOR_OFFLINE_OK';
export const GET_USER_DATA_FOR_OFFLINE_ERROR = 'GET_USER_DATA_FOR_OFFLINE_ERROR';

export const GET_INITIAL_DATA_FOR_OFFLINE = 'GET_INITIAL_DATA_FOR_OFFLINE';
export const GET_INITIAL_DATA_FOR_OFFLINE_INIT = 'GET_INITIAL_DATA_FOR_OFFLINE_INIT';
export const GET_INITIAL_DATA_FOR_OFFLINE_OK = 'GET_INITIAL_DATA_FOR_OFFLINE_OK';
export const GET_INITIAL_DATA_FOR_OFFLINE_ERROR = 'GET_INITIAL_DATA_FOR_OFFLINE_ERROR';

export function actionGetUserDataForOffline(values) {
    return {
        type: GET_USER_DATA_FOR_OFFLINE,
        values,
    };
}

export function actionGetInitialDataForOffline() {
    return {
        type: GET_INITIAL_DATA_FOR_OFFLINE,
    };
}

export const LOGIN = 'LOGIN';
export const LOGIN_INIT = 'LOGIN_INIT';
export const LOGIN_OK = 'LOGIN_OK';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export function actionLogin(values) {
    return {
        type: LOGIN,
        values,
    };
}

export const REGISTER = 'REGISTER';
export const REGISTER_INIT = 'REGISTER_INIT';
export const REGISTER_OK = 'REGISTER_OK';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const INSERT_ADDRESS = 'INSERT_ADDRESS';
export const INSERT_ADDRESS_INIT = 'INSERT_ADDRESS_INIT';
export const INSERT_ADDRESS_OK = 'INSERT_ADDRESS_OK';
export const INSERT_ADDRESS_ERROR = 'INSERT_ADDRESS_ERROR';

export function actionRegister(values) {
    return {
        type: REGISTER,
        values,
    };
}

export function actionInsertAddress(values) {
    return {
        type: INSERT_ADDRESS,
        values,
    };
}

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const UPLOAD_IMAGE_INIT = 'UPLOAD_IMAGE_INIT';
export const UPLOAD_IMAGE_OK = 'UPLOAD_IMAGE_OK';
export const UPLOAD_IMAGE_ERROR = 'UPLOAD_IMAGE_ERROR';

export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';
export const CHANGE_ADDRESS_INIT = 'CHANGE_ADDRESS_INIT';
export const CHANGE_ADDRESS_OK = 'CHANGE_ADDRESS_OK';
export const CHANGE_ADDRESS_ERROR = 'CHANGE_ADDRESS_ERROR';

export function actionUploadImage(values) {
    return {
        type: UPLOAD_IMAGE,
        values,
    };
}

export function actionChangeAddress(values) {
    return {
        type: CHANGE_ADDRESS,
        values,
    };
}

export const SUBMIT_PASSWORD_RESET_TOKEN = 'SUBMIT_PASSWORD_RESET_TOKEN';
export const SUBMIT_PASSWORD_RESET_TOKEN_INIT = 'SUBMIT_PASSWORD_RESET_TOKEN_INIT';
export const SUBMIT_PASSWORD_RESET_TOKEN_OK = 'SUBMIT_PASSWORD_RESET_TOKEN_OK';
export const SUBMIT_PASSWORD_RESET_TOKEN_ERROR = 'SUBMIT_PASSWORD_RESET_TOKEN_ERROR';

export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const CHANGE_PASSWORD_INIT = 'CHANGE_PASSWORD_INIT';
export const CHANGE_PASSWORD_OK = 'CHANGE_PASSWORD_OK';
export const CHANGE_PASSWORD_ERROR = 'CHANGE_PASSWORD_ERROR';

export function actionSubmitPasswordResetToken(token) {
    return {
        type: SUBMIT_PASSWORD_RESET_TOKEN,
        token,
    };
}

export function actionChangePassword(values, token) {
    return {
        type: CHANGE_PASSWORD,
        values,
        token,
    };
}

export const REQUEST_PASSWORD_CHANGE = 'REQUEST_PASSWORD_CHANGE';
export const REQUEST_PASSWORD_CHANGE_INIT = 'REQUEST_PASSWORD_CHANGE_INIT';
export const REQUEST_PASSWORD_CHANGE_OK = 'REQUEST_PASSWORD_CHANGE_OK';
export const REQUEST_PASSWORD_CHANGE_ERROR = 'REQUEST_PASSWORD_CHANGE_ERROR';

export function actionRequestPasswordChange(values) {
    return {
        type: REQUEST_PASSWORD_CHANGE,
        values,
    };
}
