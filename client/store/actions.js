import axios from 'axios';

export const CHECK_SESSION = 'CHECK_SESSION';

export function actionCheckSession(payload) {
    const url = '/api-session';

    const data = {
        payload,
    };
    return {
        type: CHECK_SESSION,
        payload: axios.post(url, data),
    };
}

export const GET_USER_DATA_FOR_OFFLINE = 'GET_USER_DATA_FOR_OFFLINE';
export const GET_INITIAL_DATA_FOR_OFFLINE = 'GET_INITIAL_DATA_FOR_OFFLINE';

export function actionGetUserDataForOffline(params) {
    const url = '/api-offline/get-offline-user';

    return {
        type: GET_USER_DATA_FOR_OFFLINE,
        payload: axios.post(url, params),
    };
}

export function actionGetInitialDataForOffline() {
    const url = '/api-offline/get-offline-initial';

    const data = {
        payload: 'getInitialDataForOffline', // same as initial data
    };

    return {
        type: GET_INITIAL_DATA_FOR_OFFLINE,
        payload: axios.post(url, data),
    };
}

export const LOGIN = 'LOGIN';

export function actionLogin(values) {
    const url = '/login_check';

    const data = {
        _email: values._username,
        _password: values._password,
        _remember_me: values._remember_me,
    };

    return {
        type: LOGIN,
        payload: axios.post(url, data),
    };
}

export const REGISTER = 'REGISTER';
export const INSERT_ADDRESS = 'INSERT_ADDRESS';

export function actionRegister(values) {
    const url = '/register/';
    const data = new URLSearchParams();
    data.append('fos_user_registration_form[email]', values.fos_user_registration_form.email);
    data.append('fos_user_registration_form[plainPassword][first]', values.fos_user_registration_form.plainPassword.first);
    data.append('fos_user_registration_form[plainPassword][second]', values.fos_user_registration_form.plainPassword.second);
    data.append('fos_user_registration_form[username]', values.fos_user_registration_form.username);
    data.append('fos_user_registration_form[address]', values.fos_user_registration_form.address_id);
    data.append('fos_user_registration_form[rgpd]', values.fos_user_registration_form.rgpd);
    data.append('fos_user_registration_form[failedLogins]', 0); // TODO this should be set automatically server side

    return {
        type: REGISTER,
        payload: axios.post(url, data),
    };
}

export function actionInsertAddress(values) {
    const url = '/api-address/insert';

    const data = new URLSearchParams();
    data.append('address_form[address1]', values.address1);
    data.append('address_form[address2]', values.address2);
    if (values.address3) {
        data.append('address_form[address3]', values.address3);
    }
    data.append('address_form[city]', values.city);
    data.append('address_form[postalCode]', values.postal_code);
    // data.append('address_form[lat]', null);
    // data.append('address_form[lng]', null);

    return {
        type: INSERT_ADDRESS,
        payload: axios.post(url, data),
    };
}

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const CHANGE_ADDRESS = 'CHANGE_ADDRESS';

export function actionUploadImage(formValues) {
    const url = '/api-userxtra/image-upload';

    return {
        type: UPLOAD_IMAGE,
        payload: axios.post(url, formValues),
    };
}

export function actionChangeAddress(values) {
    const url = '/api-address/change';
    const data = new URLSearchParams();
    data.append('address_form[address1]', values.address1);
    data.append('address_form[address2]', values.address2);
    if (values.address3) {
        data.append('address_form[address3]', values.address3);
    }
    data.append('address_form[city]', values.city);
    data.append('address_form[postalCode]', values.postalCode);
    data.append('address_form[lat]', values.lat);
    data.append('address_form[lng]', values.lng);
    return {
        type: CHANGE_ADDRESS,
        payload: axios.post(url, data),
    };
}

export const SUBMIT_PASSWORD_RESET_TOKEN = 'SUBMIT_PASSWORD_RESET_TOKEN';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

export function actionSubmitPasswordResetToken(token) {
    const url = `/api-resetting/check-token/${token}`;
    return {
        type: SUBMIT_PASSWORD_RESET_TOKEN,
        payload: axios.get(url),
    };
}

export function actionChangePassword(values, token) {
    const url = `/api-resetting/reset/${token}`;
    const data = new URLSearchParams();
    data.append('fos_user_resetting_form[plainPassword][first]', values.fos_user_resetting_form.plainPassword.first);
    data.append('fos_user_resetting_form[plainPassword][second]', values.fos_user_resetting_form.plainPassword.second);

    return {
        type: CHANGE_PASSWORD,
        payload: axios.post(url, data),
    };
}

export const REQUEST_PASSWORD_CHANGE = 'REQUEST_PASSWORD_CHANGE';

export function actionRequestPasswordChange(values) {
    const url = '/resetting/send-email';
    const data = new URLSearchParams();
    data.append('username', values.username);

    return {
        type: REQUEST_PASSWORD_CHANGE,
        payload: axios.post(url, data),
    };
}
