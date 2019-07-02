import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxPromise from 'redux-promise';
import './index.css';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './store/combine_reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(ReduxPromise),
    ),
);

ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root'),
);

registerServiceWorker();
