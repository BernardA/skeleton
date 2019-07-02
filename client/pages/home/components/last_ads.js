import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import localforage from 'localforage';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AdCard from '../../search/components/ad_card';
import { AVATAR_PLACEHOLDER_PATH } from '../../../parameters';
import styles from '../styles';

class LastAds extends React.Component {
	constructor(props){
        super(props)
        this.state = {
            lastAds: [],
        }
    }

    componentDidMount () {
        let ads = [];
        // check if active ads data already in state
        if (this.props.get_inital_data_for_offline && Object.keys(this.props.get_inital_data_for_offline).length > 0) {
            // get only first n elements of result set
            console.log('data from state')
            for(let i=0 ; i < 3 ; i++) {
                ads[i] = this.props.get_all_initial_data_for_offline.ads[i];
            }   
            this.setState({lastAds: ads})
        } else {
            let data = [];
            const set_state = (data) => {
                // get only first n elements of result set
                if (data.length > 0) {
                    for(let i=0 ; i < 3 ; i++) {
                        ads[i] = data[i];
                    }   
                }
                this.setState({lastAds: ads});
            }
            // data is not in state => check if in indexeddb
            localforage.getItem('ads').then(value => {
                if( value != null) {
                    console.log('data from indexeddb')
                    data = value;
                    set_state(data);
                } else {
                    // get active ads from remote
                    // dispatch event to get initial data for offline from header component in case ads where sent while offline
                    let getInitialData = new CustomEvent("get_initial_data");
                    window.dispatchEvent(getInitialData);
                }
            }).catch(function(err) {
                console.log(err);
            });
        }
    }

    componentDidUpdate(prevProps) {
        console.log('last ads update props', this.props)
        if (prevProps.getInitialDataForOffline != this.props.getInitialDataForOffline) {
            let data = this.props.getInitialDataForOffline.data.ads;
            // get only first n elements of result set
            let ads = [];
            if (data.length > 0) {
                for (let i = 0; i < 3; i++) {
                    ads[i] = data[i];
                }
            }
            this.setState({ lastAds: ads });
        }
    }

    render() {
        const { classes } = this.props;
        console.log('last ads props', this.props)
        console.log('last ads state', this.state)
        const ads = this.state.lastAds;
        const ad_list = (ads) => {
            let tags = ads.map ((ad, index) => {
                // if user has no img on profile, get placeholder img
                let img_path = AVATAR_PLACEHOLDER_PATH;
                if (ad.img_file) {
                    img_path = `/uploads/user_image/${ad.img_file}`;
                }
                return (
                    <AdCard 
                        key={index}
                        ad={ad}
                        imgPath={img_path}
                        display={'vertical'}
                    />
                )
            })
            return tags;
        }
        if (ads.length > 0) {
            return (
                <div id="last_ads" className={classes.scroller}>
                    {ad_list(ads)}
                </div>
            );
        } 
        return null;
	}
}

LastAds.propTypes = {
};

const mapStateToProps = (state) => {
    return {
        getInitialDataForOffline: state.getInitialDataForOffline,
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LastAds));