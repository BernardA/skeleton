import {
    CHECK_SESSION,
    GET_INITIAL_DATA_FOR_OFFLINE,
    GET_USER_DATA_FOR_OFFLINE,
    LOGIN,
    REGISTER,
    INSERT_ADDRESS,
    UPLOAD_IMAGE,
    CHANGE_ADDRESS,
    SUBMIT_PASSWORD_RESET_TOKEN,
    CHANGE_PASSWORD,
    REQUEST_PASSWORD_CHANGE,
} from './actions';

const actionTypes = {
    CHECK_SESSION,
    GET_INITIAL_DATA_FOR_OFFLINE,
    GET_USER_DATA_FOR_OFFLINE,
    LOGIN,
    REGISTER,
    INSERT_ADDRESS,
    UPLOAD_IMAGE,
    CHANGE_ADDRESS,
    SUBMIT_PASSWORD_RESET_TOKEN,
    CHANGE_PASSWORD,
    REQUEST_PASSWORD_CHANGE,
};

const createReducer = (initialState, handlers) => {
    return function reducer(state = initialState, action) {
        if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
            return handlers[action.type](state, action);
        }
        return state;
    };
};

export const onlineStatus = (state = { isOnline: true }, action) => {
    switch (action.type) {
    case 'ONLINE_STATUS':
        return { ...state, isOnline: action.isOnline };
    default:
        return state;
    }
};

export const checkSession = createReducer({}, {
    [actionTypes.CHECK_SESSION]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const getInitialDataForOffline = createReducer({}, {
    [actionTypes.GET_INITIAL_DATA_FOR_OFFLINE]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const getUserDataForOffline = createReducer({}, {
    [actionTypes.GET_USER_DATA_FOR_OFFLINE]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const login = createReducer({}, {
    [actionTypes.LOGIN]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const register = createReducer({}, {
    [actionTypes.REGISTER]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const insertAddress = createReducer({}, {
    [actionTypes.INSERT_ADDRESS]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const uploadImage = createReducer({}, {
    [actionTypes.UPLOAD_IMAGE]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const changeAddress = createReducer({}, {
    [actionTypes.CHANGE_ADDRESS]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const submitPasswordResetToken = createReducer({}, {
    [actionTypes.SUBMIT_PASSWORD_RESET_TOKEN]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const changePassword = createReducer({}, {
    [actionTypes.CHANGE_PASSWORD]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});

export const requestPasswordChange = createReducer({}, {
    [actionTypes.REQUEST_PASSWORD_CHANGE]: (state, action) => {
        const data = action.payload.data;
        return { ...state, data };
    },
});
