import {
    REGISTER_INIT,
    REGISTER_OK,
    REGISTER_ERROR,
    INSERT_ADDRESS_INIT,
    INSERT_ADDRESS_OK,
    INSERT_ADDRESS_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    dataRegister: null,
    errorReq: null,
    addressId: null,
};

export default (state = initialState, action) => {
    console.log('register reducer', action);
    switch (action.type) {
    case REGISTER_INIT:
        return {
            ...state,
            errorReq: null,
            dataRegister: null,
        };
    case REGISTER_OK:
        return {
            ...state,
            dataRegister: action.data,
        };
    case REGISTER_ERROR:
        return {
            ...state,
            errorReq: action.data,
        };
    case INSERT_ADDRESS_INIT:
        return {
            ...state,
            errorReq: null,
            addressId: null,
        };
    case INSERT_ADDRESS_OK:
        return {
            ...state,
            addressId: action.data,
        };
    case INSERT_ADDRESS_ERROR:
        return {
            ...state,
            errorReq: action.data,
        };
    default:
        return state;
    }
};
