import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import account from './account';
import auth from './auth';
import status from './status';
import register from './register';

const rootReducer = combineReducers({
    form: formReducer,
    account,
    auth,
    status,
    register,
});

export default rootReducer;
