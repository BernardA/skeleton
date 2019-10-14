import {
    CHECK_SESSION_INIT,
    CHECK_SESSION_OK,
    CHECK_SESSION_ERROR,
    GET_INITIAL_DATA_FOR_OFFLINE_INIT,
    GET_INITIAL_DATA_FOR_OFFLINE_OK,
    GET_INITIAL_DATA_FOR_OFFLINE_ERROR,
    GET_USER_DATA_FOR_OFFLINE_INIT,
    GET_USER_DATA_FOR_OFFLINE_OK,
    GET_USER_DATA_FOR_OFFLINE_ERROR,
    ONLINE_STATUS,
} from '../actions';

const initialState = {
    errorCheckSession: null,
    errorOfflineInitial: null,
    errorOfflineUser: null,
    dataSession: null,
    dataOfflineInitial: null,
    dataOfflineUser: null,
    isOnline: true,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case ONLINE_STATUS:
        return {
            ...state,
            isOnline: action.isOnline,
        };
    case CHECK_SESSION_INIT:
        return {
            ...state,
            errorCheckSession: null,
            dataSession: null,
        };
    case CHECK_SESSION_OK:
        return {
            ...state,
            dataSession: action.data,
        };
    case CHECK_SESSION_ERROR:
        return {
            ...state,
            errorCheckSession: action.data,
        };
    case GET_INITIAL_DATA_FOR_OFFLINE_INIT:
        return {
            ...state,
            errorOfflineInitial: null,
            dataOfflineInitial: null,
        };
    case GET_INITIAL_DATA_FOR_OFFLINE_OK:
        return {
            ...state,
            dataOfflineInitial: action.data,
        };
    case GET_INITIAL_DATA_FOR_OFFLINE_ERROR:
        return {
            ...state,
            errorOfflineInitial: action.data,
        };
    case GET_USER_DATA_FOR_OFFLINE_INIT:
        return {
            ...state,
            errorOfflineUser: null,
            dataOfflineUser: null,
        };
    case GET_USER_DATA_FOR_OFFLINE_OK:
        return {
            ...state,
            dataOfflineUser: action.data,
        };
    case GET_USER_DATA_FOR_OFFLINE_ERROR:
        return {
            ...state,
            errorOfflineUser: action.data,
        };
    default:
        return state;
    }
};
