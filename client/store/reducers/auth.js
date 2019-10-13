import {
    LOGIN_INIT,
    LOGIN_OK,
    LOGIN_ERROR,
    SUBMIT_PASSWORD_RESET_TOKEN_INIT,
    SUBMIT_PASSWORD_RESET_TOKEN_OK,
    SUBMIT_PASSWORD_RESET_TOKEN_ERROR,
    CHANGE_PASSWORD_INIT,
    CHANGE_PASSWORD_OK,
    CHANGE_PASSWORD_ERROR,
    REQUEST_PASSWORD_CHANGE_INIT,
    REQUEST_PASSWORD_CHANGE_OK,
    REQUEST_PASSWORD_CHANGE_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    referer: null,
    sessionInfo: null,
    userId: null,
    errorLogin: null,
    dataResetToken: null,
    errorResetToken: null,
    dataChangePassword: null,
    errorChangePassword: null,
    dataRequestPassword: null,
    errorRequestPassword: null,
};

export default (state = initialState, action) => {
    console.log('offline reducer', action);
    switch (action.type) {
    case LOGIN_INIT:
        return {
            ...state,
            isLoading: true,
            errorLogin: null,
            referer: null,
            sessionInfo: null,
            userId: null,
        };
    case LOGIN_OK:
        return {
            ...state,
            isLoading: false,
            referer: action.data.referer,
            sessionInfo: action.data.sessionInfo,
            userId: action.data.userId,
        };
    case LOGIN_ERROR:
        return {
            ...state,
            isLoading: false,
            errorLogin: action.data,
        };
    case SUBMIT_PASSWORD_RESET_TOKEN_INIT:
        return {
            ...state,
            isLoading: true,
            errorResetToken: null,
            dataResetToken: null,
        };
    case SUBMIT_PASSWORD_RESET_TOKEN_OK:
        return {
            ...state,
            isLoading: false,
            dataResetToken: action.data,
        };
    case SUBMIT_PASSWORD_RESET_TOKEN_ERROR:
        return {
            ...state,
            isLoading: false,
            errorResetToken: action.data,
        };
    case CHANGE_PASSWORD_INIT:
        return {
            ...state,
            isLoading: true,
            errorChangePassword: null,
            dataChangePassword: null,
        };
    case CHANGE_PASSWORD_OK:
        return {
            ...state,
            isLoading: false,
            dataChangePassword: action.data,
        };
    case CHANGE_PASSWORD_ERROR:
        return {
            ...state,
            isLoading: false,
            errorChangePassword: action.data,
        };
    case REQUEST_PASSWORD_CHANGE_INIT:
        return {
            ...state,
            isLoading: true,
            errorResetToken: null,
            dataRequestPassword: null,
        };
    case REQUEST_PASSWORD_CHANGE_OK:
        return {
            ...state,
            isLoading: false,
            dataRequestPassword: action.data,
        };
    case REQUEST_PASSWORD_CHANGE_ERROR:
        return {
            ...state,
            isLoading: false,
            errorRequestPassword: action.data,
        };
    default:
        return state;
    }
};
