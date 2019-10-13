import {
    all, call, put, takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';
import localforage from 'localforage';
import { Now } from '../tools/functions';
import {
    CHECK_SESSION,
    CHECK_SESSION_INIT,
    CHECK_SESSION_OK,
    CHECK_SESSION_ERROR,
    GET_USER_DATA_FOR_OFFLINE,
    GET_USER_DATA_FOR_OFFLINE_INIT,
    GET_USER_DATA_FOR_OFFLINE_OK,
    GET_USER_DATA_FOR_OFFLINE_ERROR,
    GET_INITIAL_DATA_FOR_OFFLINE,
    GET_INITIAL_DATA_FOR_OFFLINE_INIT,
    GET_INITIAL_DATA_FOR_OFFLINE_OK,
    GET_INITIAL_DATA_FOR_OFFLINE_ERROR,
    LOGIN,
    LOGIN_INIT,
    LOGIN_OK,
    LOGIN_ERROR,
    REGISTER,
    REGISTER_INIT,
    REGISTER_OK,
    REGISTER_ERROR,
    INSERT_ADDRESS,
    INSERT_ADDRESS_INIT,
    INSERT_ADDRESS_OK,
    INSERT_ADDRESS_ERROR,
    UPLOAD_IMAGE,
    UPLOAD_IMAGE_INIT,
    UPLOAD_IMAGE_OK,
    UPLOAD_IMAGE_ERROR,
    CHANGE_ADDRESS,
    CHANGE_ADDRESS_INIT,
    CHANGE_ADDRESS_OK,
    CHANGE_ADDRESS_ERROR,
    SUBMIT_PASSWORD_RESET_TOKEN,
    SUBMIT_PASSWORD_RESET_TOKEN_INIT,
    SUBMIT_PASSWORD_RESET_TOKEN_OK,
    SUBMIT_PASSWORD_RESET_TOKEN_ERROR,
    CHANGE_PASSWORD,
    CHANGE_PASSWORD_INIT,
    CHANGE_PASSWORD_OK,
    CHANGE_PASSWORD_ERROR,
    REQUEST_PASSWORD_CHANGE,
    REQUEST_PASSWORD_CHANGE_INIT,
    REQUEST_PASSWORD_CHANGE_OK,
    REQUEST_PASSWORD_CHANGE_ERROR,
    ONLINE_STATUS,
} from './actions';

const MY_API = 'MY_API';
const API_ROOT = 'http://localhost';

const api = (
    method,
    urlSuffix,
    data = null,
    headers = null,
    endpoint = MY_API,
) => {
    // update last active on indexeddb
    localforage.setItem('lastActiveAt', Now());
    let url = `${API_ROOT}${urlSuffix}`;
    if (endpoint !== MY_API) {
        url = urlSuffix;
    }
    return axios({
        method,
        url,
        data,
        headers,
    }).then((response) => {
        console.log('response axios', response);
        return response.data;
    });
};

function errorParser(error) {
    console.log('error parser', error);
    return false;
}

function isOffline(error) {
    console.log('isoffline', error.response);
    // check if offline event already fired
    localforage.getItem('offline-event-fired').then((value) => {
        if (value === null) {
            window.dispatchEvent(new Event('offline'));
            localforage.setItem('offline-event-fired', true);
        }
    });
    return !!(error.response === undefined || error.code === 'ECONNABORTED');
}

function* checkSession(action) {
    console.log('check session', action);
    const url = '/api-session';
    try {
        yield put({
            type: CHECK_SESSION_INIT,
        });

        const data = yield call(api, 'get', url);
        yield put({
            type: CHECK_SESSION_OK,
            data,
        });
        console.log('check session response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('check session error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: CHECK_SESSION_ERROR,
            data,
        });
    }
}

function* getInitialDataForOffline(action) {
    console.log('initial data', action);
    const url = '/api-offline/get-offline-initial';
    try {
        yield put({
            type: GET_INITIAL_DATA_FOR_OFFLINE_INIT,
        });

        const data = yield call(api, 'get', url);
        yield put({
            type: GET_INITIAL_DATA_FOR_OFFLINE_OK,
            data,
        });
        console.log('initial response data', data);
        localforage.setItem('timestamp-initialdata', new Date());
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('initial off response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: GET_INITIAL_DATA_FOR_OFFLINE_ERROR,
            data,
        });
    }
}

function* getUserDataForOffline(action) {
    console.log('initial data', action);
    const url = '/api-offline/get-offline-user';
    try {
        yield put({
            type: GET_USER_DATA_FOR_OFFLINE_INIT,
        });

        const data = yield call(api, 'get', url);
        yield put({
            type: GET_USER_DATA_FOR_OFFLINE_OK,
            data,
        });
        console.log('user offline response data', data);
        localforage.setItem('profile', data.profile);
        localforage.setItem('timestamp-userdata', new Date());
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('user offline response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }
        if (isOffline()) {
            window.addEventListener('isOnline', this.getUserDataForOffline);
        }
        yield put({
            type: GET_USER_DATA_FOR_OFFLINE_ERROR,
            data,
        });
    }
}

function* login(action) {
    console.log('initial data', action);
    const url = '/login_check';
    const values = {
        _email: action.values._username,
        _password: action.values._password,
        _remember_me: action.values._remember_me,
    };
    try {
        yield put({
            type: LOGIN_INIT,
        });

        const data = yield call(api, 'post', url, values);
        yield put({
            type: LOGIN_OK,
            data,
        });
        console.log('login response data', data);
        localforage.setItem('bda_session', data.sessionInfo);
        localforage.setItem('last_active', { server: Now(), client: Now() });
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('login response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }
        yield put({
            type: LOGIN_ERROR,
            data,
        });
    }
}

function* register(action) {
    console.log('register', action);
    const url = '/register/';
    const values = new URLSearchParams();
    values.append('fos_user_registration_form[email]', action.values.fos_user_registration_form.email);
    values.append('fos_user_registration_form[plainPassword][first]', action.values.fos_user_registration_form.plainPassword.first);
    values.append('fos_user_registration_form[plainPassword][second]', action.values.fos_user_registration_form.plainPassword.second);
    values.append('fos_user_registration_form[username]', action.values.fos_user_registration_form.username);
    values.append('fos_user_registration_form[address]', action.values.fos_user_registration_form.address_id);
    values.append('fos_user_registration_form[rgpd]', action.values.fos_user_registration_form.rgpd);
    values.append('fos_user_registration_form[failedLogins]', 0); // TODO this should be set automatically server side
    try {
        yield put({
            type: REGISTER_INIT,
        });

        const data = yield call(api, 'post', url, values);
        yield put({
            type: REGISTER_OK,
            data,
        });
        console.log('register response data', data);
        // localforage.setItem('token', data.token);
        // localforage.setItem('refreshToken', data.refresh_token);
        // localforage.setItem('userId', data.id);
        // axios.defaults.headers.common = { Authorization: `Bearer ${data.token}` };
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('response response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: REGISTER_ERROR,
            data,
        });
    }
}

function* insertAddress(action) {
    console.log('insert address action', action);
    const url = '/api-address/insert';
    const values = new URLSearchParams();
    values.append('address_form[address1]', action.values.address1);
    values.append('address_form[address2]', action.values.address2);
    if (action.values.address3) {
        values.append('address_form[address3]', action.values.address3);
    }
    values.append('address_form[city]', action.values.city);
    values.append('address_form[postalCode]', action.values.postal_code);
    // values.append('address_form[lat]', null);
    // values.append('address_form[lng]', null);
    try {
        yield put({
            type: INSERT_ADDRESS_INIT,
        });

        const data = yield call(api, 'post', url, values);
        yield put({
            type: INSERT_ADDRESS_OK,
            data,
        });
        console.log('insert address response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('insert address response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: INSERT_ADDRESS_ERROR,
            data,
        });
    }
}

function* uploadImage(action) {
    console.log('upload image action', action);
    const url = '/api-userxtra/image-upload';
    try {
        yield put({
            type: UPLOAD_IMAGE_INIT,
        });

        const data = yield call(api, 'post', url, action.values);
        yield put({
            type: UPLOAD_IMAGE_OK,
            data,
        });
        console.log('upload image response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('upload response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: UPLOAD_IMAGE_ERROR,
            data,
        });
    }
}

function* changeAddress(action) {
    console.log('change address action', action);
    const url = '/api-address/change';
    const values = new URLSearchParams();
    values.append('address_form[address1]', action.values.address1);
    values.append('address_form[address2]', action.values.address2);
    if (action.values.address3) {
        values.append('address_form[address3]', action.values.address3);
    }
    values.append('address_form[city]', action.values.city);
    values.append('address_form[postalCode]', action.values.postalCode);
    values.append('address_form[lat]', action.values.lat);
    values.append('address_form[lng]', action.values.lng);
    try {
        yield put({
            type: CHANGE_ADDRESS_INIT,
        });

        const data = yield call(api, 'post', url, values);
        yield put({
            type: CHANGE_ADDRESS_OK,
            data,
        });
        console.log('change address response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('change address response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }
        yield put({
            type: CHANGE_ADDRESS_ERROR,
            data,
        });
    }
}

function* submitPasswordResetToken(action) {
    console.log('submit password token action', action);
    const url = `/api-resetting/check-token/${action.token}`;
    try {
        yield put({
            type: SUBMIT_PASSWORD_RESET_TOKEN_INIT,
        });

        const data = yield call(api, 'get', url);
        yield put({
            type: SUBMIT_PASSWORD_RESET_TOKEN_OK,
            data,
        });
        console.log('submit password token response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('submit password token response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: SUBMIT_PASSWORD_RESET_TOKEN_ERROR,
            data,
        });
    }
}

function* changePassword(action) {
    console.log('change password action', action);
    const url = `/api-resetting/reset/${action.token}`;
    const values = new URLSearchParams();
    values.append('fos_user_resetting_form[plainPassword][first]', action.values.fos_user_resetting_form.plainPassword.first);
    values.append('fos_user_resetting_form[plainPassword][second]', action.values.fos_user_resetting_form.plainPassword.second);
    try {
        yield put({
            type: CHANGE_PASSWORD_INIT,
        });

        const data = yield call(api, 'post', url, values);
        yield put({
            type: CHANGE_PASSWORD_OK,
            data,
        });
        console.log('change password response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('change password response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: CHANGE_PASSWORD_ERROR,
            data,
        });
    }
}

function* requestPasswordChange(action) {
    console.log('request password action', action);
    const url = '/resetting/send-email';
    const values = new URLSearchParams();
    values.append('username', action.values.username);
    try {
        yield put({
            type: REQUEST_PASSWORD_CHANGE_INIT,
        });

        const data = yield call(api, 'post', url, values);
        yield put({
            type: REQUEST_PASSWORD_CHANGE_OK,
            data,
        });
        console.log('request password response data', data);
    } catch (error) {
        const isOff = isOffline(error);
        const data = isOff ? null : errorParser(error.response);
        console.log('reques password response error', error.response);
        if (isOff) {
            yield put({
                type: ONLINE_STATUS,
                isOnline: false,
            });
        }

        yield put({
            type: REQUEST_PASSWORD_CHANGE_ERROR,
            data,
        });
    }
}

export default function* () {
    yield all([
        takeLatest(CHECK_SESSION, checkSession),
        takeLatest(GET_INITIAL_DATA_FOR_OFFLINE, getInitialDataForOffline),
        takeLatest(GET_USER_DATA_FOR_OFFLINE, getUserDataForOffline),
        takeLatest(LOGIN, login),
        takeLatest(REGISTER, register),
        takeLatest(INSERT_ADDRESS, insertAddress),
        takeLatest(UPLOAD_IMAGE, uploadImage),
        takeLatest(CHANGE_ADDRESS, changeAddress),
        takeLatest(SUBMIT_PASSWORD_RESET_TOKEN, submitPasswordResetToken),
        takeLatest(CHANGE_PASSWORD, changePassword),
        takeLatest(REQUEST_PASSWORD_CHANGE, requestPasswordChange),
    ]);
}
