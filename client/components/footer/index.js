import React from 'react';
import Img from 'react-webp-image';
import { Link } from 'react-router-dom';
import ButtonBase from '@material-ui/core/ButtonBase';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
    MAIN_LOGO_PATH_PNG,
    MAIN_LOGO_PATH_WEBP,
    FACEBOOK_PATH,
    PINTEREST_PATH,
    TWITTER_PATH,
} from '../../parameters';
import styles from './styles';
/*
waiting for a solution on https://stackoverflow.com/questions/56577560/react-material-ui-withstyles-on-external-file-not-working
const stylesMui = theme => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            gridTemplateColumns: 'repeat(auto- fit, minmax(230px, 280px))',
            backgroundColor: green[500]
        },
    },
});
*/

class Footer extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <footer className={classes.root}>
                <section className={classes.section}>
                    <h3>Menu</h3>
                    <div className={classes.sectionDiv}>
                        <ButtonBase
                            className={classes.sectionDivA}
                            component={Link}
                            to="/"
                        >
                            <span>Home</span>
                        </ButtonBase>
                        <ButtonBase
                            className={classes.sectionDivA}
                            component={Link}
                            to="/"
                        >
                            <span>Create ad</span>
                        </ButtonBase>
                        <ButtonBase
                            className={classes.sectionDivA}
                            component={Link}
                            to="/search"
                        >
                            <span>Search</span>
                        </ButtonBase>
                        <ButtonBase
                            className={classes.sectionDivA}
                            component={Link}
                            to="/account"
                        >
                            <span>Account</span>
                        </ButtonBase>
                        <ButtonBase
                            className={classes.sectionDivA}
                            component={Link}
                            to="/mailbox/inbox"
                        >
                            <span>Mailbox</span>
                        </ButtonBase>
                    </div>
                </section>
                <section className={classes.section}>
                    <h3>Social</h3>
                    <div className={classes.social}>
                        <img
                            className={classes.socialImg}
                            src={FACEBOOK_PATH}
                            alt="facebook"
                        />
                        <img
                            className={classes.socialImg}
                            src={PINTEREST_PATH}
                            alt="facebook"
                        />
                        <img
                            className={classes.socialImg}
                            src={TWITTER_PATH}
                            alt="facebook"
                        />
                    </div>
                    <ButtonBase component={Link} to="/">
                        <Img
                            src={MAIN_LOGO_PATH_PNG}
                            webp={MAIN_LOGO_PATH_WEBP}
                            alt="logo"
                        />
                    </ButtonBase>
                </section>
                <section className={classes.section}>
                    <h3>Our mission</h3>
                    <p className={classes.sectionP}>
                        Nam sole orto magnitudine angusti gurgitis sed
                        profundi a transitu arcebantur et dum
                        piscatorios.
                    </p>
                    <p className={classes.sectionP}>
                        Quaerunt lenunculos vel innare temere contextis
                        cratibus parant, effusae legiones, quae
                        hiemabant tunc apud.
                    </p>
                    <p className={classes.sectionP}>
                        Siden, isdem impetu occurrere veloci. et signis
                        prope ripam locatis ad manus comminus
                        conserendas denseta scutorum conpage semet
                        scientissime.
                    </p>
                </section>
            </footer>
        );
    }
}

Footer.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Footer);
