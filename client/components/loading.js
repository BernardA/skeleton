/* eslint-disable react/prop-types */
import React from 'react';
import { LOADING_INDICATOR_IMG } from '../parameters';

export const LoadingVisibility = (props) => {
    if (props.pastDelay) {
        return (
            <div className="loading_indicator">
                <img src={LOADING_INDICATOR_IMG} alt="loading" />
            </div>
        );
    }
    return null;
};

export const Loading = () => {
    return (
        <div className="loading_indicator">
            <img src={LOADING_INDICATOR_IMG} alt="loading" />
        </div>
    );
};
