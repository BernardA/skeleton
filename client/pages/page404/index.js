import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import { LoadingVisibility } from '../../components/loading';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});

const MyLink = props => <Link to="/" {...props} />;

const Page404 = (props) => {
    return (
        <React.Fragment>
            <main>
                <div className="main-title">
                    <h1> Page not found. 404 Error </h1>
                </div>
                <Card>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            No match for
                            <code>{props.location.pathname}</code>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={MyLink} variant="contained">
                            Return to homepage
                        </Button>
                    </CardActions>
                </Card>
            </main>
            <Footer />
        </React.Fragment>
    );
};

Page404.propTypes = {
    location: PropTypes.object.isRequired,
};

export default Page404;
