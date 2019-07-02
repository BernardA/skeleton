import React from 'react';
import PropTypes from 'prop-types';
import ArrowBackIosOutlinedIcon from '@material-ui/icons/ArrowBackIosOutlined';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';

// from https://github.com/gladchinda/build-react-pagination-demo
const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
    let i = from;
    const range1 = [];

    while (i <= to) {
        range1.push(i);
        i += step;
    }

    return range1;
};

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentPage: 1 };
    }

    componentDidMount() {
        this.updateConfig();
        this.gotoPage(1);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.totalRecords !== this.props.totalRecords) {
            this.updateConfig();
            this.gotoPage(1);
        }
    }

    gotoPage = (page) => {
        const { handlePageChanged = f => f } = this.props;

        const currentPage = Math.max(0, Math.min(page, this.totalPages));

        const paginationData = {
            currentPage,
            totalPages: this.totalPages,
            pageLimit: this.pageLimit,
            totalRecords: this.totalRecords,
        };
        this.setState({ currentPage }, () => handlePageChanged(paginationData));
    };

    handleClick = page => (event) => {
        event.preventDefault();
        this.gotoPage(page);
    };

    handleMoveLeft = (event) => {
        event.preventDefault();
        this.gotoPage(this.state.currentPage - this.pageNeighbours * 2 - 1);
    };

    handleMoveRight = (event) => {
        event.preventDefault();
        this.gotoPage(this.state.currentPage + this.pageNeighbours * 2 + 1);
    };

    /**
     * Let's say we have 10 pages and we set pageNeighbours to 2
     * Given that the current page is 6
     * The pagination control will look like the following:
     *
     * (1) < {4 5} [6] {7 8} > (10)
     *
     * (x) => terminal pages: first and last page(always visible)
     * [x] => represents current page
     * {...x} => represents page neighbours
     */
    fetchPageNumbers = () => {
        const totalPages = this.totalPages;
        const currentPage = this.state.currentPage;
        const pageNeighbours = this.pageNeighbours;

        /**
         * totalNumbers: the total page numbers to show on the control
         * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
         */
        const totalNumbers = this.pageNeighbours * 2 + 3;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(
                totalPages - 1,
                currentPage + pageNeighbours,
            );

            let pages = range(startPage, endPage);

            /**
             * hasLeftSpill: has hidden pages to the left
             * hasRightSpill: has hidden pages to the right
             * spillOffset: number of hidden pages either to the left or to the right
             */
            const hasLeftSpill = startPage > 2;
            const hasRightSpill = totalPages - endPage > 1;
            const spillOffset = totalNumbers - (pages.length + 1);

            switch (true) {
            // handle: (1) < {5 6} [7] {8 9} (10)
            case hasLeftSpill && !hasRightSpill: {
                const extraPages = range(
                    startPage - spillOffset,
                    startPage - 1,
                );
                pages = [LEFT_PAGE, ...extraPages, ...pages];
                break;
            }

            // handle: (1) {2 3} [4] {5 6} > (10)
            case !hasLeftSpill && hasRightSpill: {
                const extraPages = range(
                    endPage + 1,
                    endPage + spillOffset,
                );
                pages = [...pages, ...extraPages, RIGHT_PAGE];
                break;
            }

            // handle: (1) < {4 5} [6] {7 8} > (10)
            case hasLeftSpill && hasRightSpill:
            default: {
                pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                break;
            }
            }
            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    };

    updateConfig() {
        const {
            totalRecords = null,
            pageLimit = 30,
            pageNeighbours = 0,
        } = this.props;

        this.pageLimit = typeof pageLimit === 'number' ? pageLimit : 30;
        this.totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;

        // pageNeighbours can be: 0, 1 or 2
        this.pageNeighbours =
            typeof pageNeighbours === 'number'
                ? Math.max(0, Math.min(pageNeighbours, 0))
                : 0;

        this.totalPages = Math.ceil(this.totalRecords / this.pageLimit);
        this.setState({ currentPage: 1 });
    }

    render() {
        if (!this.totalRecords || this.totalPages === 1) return null;

        const { currentPage } = this.state;
        const pages = this.fetchPageNumbers();
        return (
            <div id="pagination" className="grid">
                <Chip label={`${this.totalRecords} Items`} />
                <MenuList className="flex">
                    {pages.map((page, index) => {
                        if (page === LEFT_PAGE) {
                            return (
                                <MenuItem key={index} className="page-item">
                                    {/* <a className="page-link" href="#" onClick={this.handleMoveLeft}> */}
                                    <Fab
                                        className="page-link"
                                        onClick={this.handleMoveLeft}
                                    >
                                        <ArrowBackIosOutlinedIcon />
                                    </Fab>
                                    {/* <span className="sr-only">Previous</span> */}
                                    {/* </a> */}
                                </MenuItem>
                            );
                        }
                        if (page === RIGHT_PAGE) {
                            return (
                                <MenuItem key={index} className="page-item">
                                    {/* <a className="page-link" href="#" onClick={this.handleMoveRight}> */}
                                    <Fab
                                        className="page-link"
                                        onClick={this.handleMoveRight}
                                    >
                                        <ArrowForwardIosOutlinedIcon />
                                    </Fab>
                                    {/* <span className="sr-only">Next</span> */}
                                    {/* </a> */}
                                </MenuItem>
                            );
                        }
                        return (
                            <MenuItem
                                key={index}
                                className={`page-item${
                                    currentPage === page ? ' active' : ''
                                }`}
                            >
                                {/* <a className="page-link" href="#" onClick={ this.handleClick(page) }> */}
                                <Fab
                                    className="page-link"
                                    onClick={this.handleClick(page)}
                                >
                                    {page}
                                </Fab>
                                {/* </a> */}
                            </MenuItem>
                        );
                    })}
                </MenuList>
                {/* </nav> */}
            </div>
        );
    }
}

Pagination.propTypes = {
    totalRecords: PropTypes.number.isRequired,
    pageLimit: PropTypes.number.isRequired,
    pageNeighbours: PropTypes.number.isRequired,
    handlePageChanged: PropTypes.func.isRequired,
};

export default Pagination;
