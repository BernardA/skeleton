import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagas from './store/sagas';
import './index.css';
import Root from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './store/reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(sagaMiddleware),
    ),
);
sagaMiddleware.run(sagas);
ReactDOM.render(
    <Root store={store} />,
    document.querySelector('#root'),
);

registerServiceWorker();
