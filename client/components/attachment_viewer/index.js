import React from 'react';
import Lightbox from 'react-images';
import { Document, Page } from 'react-pdf';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES, ATTACHMENT_DIR } from '../../parameters';
import NotifierDialog from '../../components/notifier_dialog';

import { LoadingVisibility } from '../../components/loading';

const Footer = LoadableVisibility({
    loader: () => import('../footer/'),
    loading: LoadingVisibility,
});

class AttachmentViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lightboxIsOpen: false,
            numPages: null,
            pageNumber: 1,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        };
    }

    componentDidMount() {
        const fileType = this.props.match.params.file_name.split('.').pop();
        const isAccepted = MESSAGE_ATTACHMENT_ACCEPTED_MIME_TYPES.filter((type) => {
            return type.includes(fileType);
        });
        if (isAccepted.length === 0) {
            this.setState({
                notification: {
                    status: 'error',
                    title: '',
                    message: 'The file type is invalid.',
                    errors: {},
                },
            });
        } else {
            const isImage = isAccepted.filter((type) => {
                return type.includes('jpeg') || type.includes('jpg') || type.includes('png');
            });
            if (isImage.length > 0) {
                this.setState({ lightboxIsOpen: true });
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            lightboxIsOpen: false,
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }

    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }

    gotoPrevious = () => {

    }

    gotoNext = () => {

    }

    closeLightbox = () => {
        this.setState({ lightboxIsOpen: false });
        if (this.props.location.state) {
            this.props.history.push(this.props.location.state.location);
        }
    }

    closePdf = () => {
        if (this.props.location.state) {
            this.props.history.push(this.props.location.state.location);
        }
    }

    handleNotificationDismiss = () => {
        this.setState({
            notification: {
                status: '',
                title: '',
                message: '',
                errors: {},
            },
        });
    }

    handleFileLoadError = () => {
        this.setState({
            notification: {
                status: 'error',
                title: '',
                message: 'The file does not exists or could not be loaded.',
                errors: {},
            },
        });
    }

    render() {
        const src = `${ATTACHMENT_DIR}${this.props.match.params.file_name}`;
        const fileType = this.props.match.params.file_name.split('.').pop();
        if (this.state.notification.status !== 'error') {
            if (!fileType.includes('pdf')) { // not pdf file
                return (
                    <React.Fragment>
                        <main className="doc_viewer">
                            <Lightbox
                                images={[{ src }]}
                                isOpen={this.state.lightboxIsOpen}
                                onClickPrev={this.gotoPrevious}
                                onClickNext={this.gotoNext}
                                onClose={this.closeLightbox}
                            />
                        </main>
                        <Footer />
                    </React.Fragment>
                );
            }
            const { pageNumber, numPages } = this.state;
            return (
                <React.Fragment>
                    <main className="doc_viewer grid">
                        <Button
                            id="back_to_message"
                            onClick={this.closePdf}
                        >
                            Retour
                        </Button>
                        <p>{`Page ${pageNumber} of ${numPages}`}</p>
                        <Document
                            file={src}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            renderMode="svg"
                            error={this.handleFileLoadError}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                    </main>
                    <Footer />
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                <main>
                    <NotifierDialog
                        notification={this.state.notification}
                        handleNotificationDismiss={this.handleNotificationDismiss}
                    />
                </main>
                <Footer />
            </React.Fragment>
        );
    }
}

AttachmentViewer.propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default AttachmentViewer;
