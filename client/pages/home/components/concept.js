import React from 'react';
import Img from "react-webp-image";
import LazyLoad from 'react-lazy-load';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import styles from '../styles';

class Concept extends React.Component {
	constructor(props){
        super(props)
    }

    render() {
        const { classes } = this.props;
		return (
            <div className={classes.scroller}>
                <div className={classes.conceptImg}>
                    <LazyLoad 
                        debounce={false}
                        offsetVertical={200}
                    >
                        <Img 
                            src="/img/concept-1.070219.jpg" 
                            webp="/img/concept-1.070219.webp"
                            alt="how it works 1" 
                        />
                    </LazyLoad>
                </div>
                <div className={classes.conceptImg}>
                    <LazyLoad 
                        debounce={false}
                        offsetVertical={200}
                    >
                        <Img 
                            src="/img/concept-2.070219.jpg" 
                            webp="/img/concept-2.070219.webp"
                            alt="how it works 2" 
                        />
                    </LazyLoad>
                </div>   
                <div className={classes.conceptImg}>
                    <LazyLoad 
                        debounce={false}
                        offsetVertical={200}
                    >
                        <Img 
                            src="/img/concept-3.070219.jpg"
                            webp="/img/concept-3.070219.webp" 
                            alt="how it works 3" 
                        />
                    </LazyLoad>
                </div>
            </div>
		);
	}
}

Concept.propTypes = {
};

export default withStyles(styles)(Concept);