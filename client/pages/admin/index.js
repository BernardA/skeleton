import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import PropTypes from 'prop-types';
import { LoadingVisibility } from '../../components/loading';
import CategoryInsertForm from './components/category_insert_form';
import CategoryDeleteForm from './components/category_delete_form';

const Footer = LoadableVisibility({
    loader: () => import('../../components/footer'),
    loading: LoadingVisibility,
});


const styles = theme => ({
    button: {
        margin: theme.spacing(1),
    },
    col3: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gridGap: '1rem',
        minHeight: '300px',
        backgroundColor: '#fff',
    },
    subh2: {
        color: '#066',
        letterSpacing: '.1rem',
        fontSize: '16px',
        height: '40px',
    },
});


class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: false,
            isClearInsertCategoryForm: false,
            isClearDeleteCategoryForm: false,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // put back state to default after resetting forms
        if (prevState.isClearDeleteCategoryForm || prevState.isClearInsertCategoryForm) {
            this.setState({
                isClearDeleteCategoryForm: false,
                isClearInsertCategoryForm: false,
            });
        }
    }

    render() {
        console.log('admin state', this.state);
        console.log('admin props', this.props);

        const { classes } = this.props;
        return (
            <React.Fragment>
                <main>
                    <h1> Hello World from ADMIN! </h1>
                    <div className={classes.col3}>
                        <div>
                            <h2 className={classes.subh2}>Insert category </h2>
                            {
                                this.state.categories ? (
                                    <CategoryInsertForm
                                        // eslint-disable-next-line max-len
                                        isClearInsertCategoryForm={this.state.isClearInsertCategoryForm}
                                    />
                                ) :
                                    null
                            }
                        </div>
                        <div>
                            <h2 className={classes.subh2}> Delete category </h2>
                            {
                                this.state.categories ? (
                                    <CategoryDeleteForm
                                        // eslint-disable-next-line max-len
                                        isClearDeleteCategoryForm={this.state.isClearDeleteCategoryForm}
                                    />
                                ) :
                                    null
                            }
                        </div>
                        <div>
                            <h2 className={classes.subh2}> toggle active ad </h2>

                        </div>
                    </div>
                    <div className={classes.col3}>
                        <div>
                            <h2 className={classes.subh2}>toggle active user </h2>
                        </div>
                        <div>
                            <h2 className={classes.subh2}> tbd </h2>

                        </div>
                        <div>
                            <h2 className={classes.subh2}> tbd  </h2>
                        </div>
                    </div>

                </main>
                <Footer />
            </React.Fragment>
        );
    }
}

Admin.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        category_insert_form: state.form.CategoryInsertForm,
        category_delete_form: state.form.CategoryDeleteForm,
        getInitialDataForOffline: state.getInitialDataForOffline,
    };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Admin));
