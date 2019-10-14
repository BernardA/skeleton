export default () => {
    return ({
        root: {
            textAlign: 'center',
            maxWidth: '300px',
            margin: '0 auto',
        },
        header: {
            margin: '20px auto',
        },
        title: {
            textTransform: 'uppercase',
        },
        subheader: {
            marginTop: '20px',
        },
        content: {
            margin: '20px auto',
            padding: 0,
            '& > div:first-of-type': {
                margin: '20px 0',
            },
        },
        forgotPassword: {
            display: 'block',
            textAlign: 'right',
        },
        button: {
            margin: '20px 0',
        },
        formGroup: {
            marginRight: 0,
            justifyContent: 'space-between',
            lineHeight: '45px',
        },
        lineWrapSpan: {
            display: 'block',
        },
    });
};
