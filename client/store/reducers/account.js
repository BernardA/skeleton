import {
    UPLOAD_IMAGE_INIT,
    UPLOAD_IMAGE_OK,
    UPLOAD_IMAGE_ERROR,
    CHANGE_ADDRESS_INIT,
    CHANGE_ADDRESS_OK,
    CHANGE_ADDRESS_ERROR,
} from '../actions';

const initialState = {
    isLoading: false,
    dataUpload: null,
    errorUpload: null,
    errorAddress: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
    case UPLOAD_IMAGE_INIT:
        return {
            ...state,
            errorUpload: null,
            dataUpload: null,
        };
    case UPLOAD_IMAGE_OK:
        return {
            ...state,
            dataUpload: action.data,
        };
    case UPLOAD_IMAGE_ERROR:
        return {
            ...state,
            errorUpload: action.data,
        };
    case CHANGE_ADDRESS_INIT:
        return {
            ...state,
            errorAddress: null,
            dataAddress: null,
        };
    case CHANGE_ADDRESS_OK:
        return {
            ...state,
            dataAddress: action.data,
        };
    case CHANGE_ADDRESS_ERROR:
        return {
            ...state,
            errorAddress: action.data,
        };
    default:
        return state;
    }
};
