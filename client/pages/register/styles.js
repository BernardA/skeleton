
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
        content: {
            margin: '20px auto',
            padding: 0,
            '& > div:first-of-type': {
                margin: '20px 0',
            },
        },
        button: {
            margin: '20px 0',
        },
        lineWrapSpan: {
            display: 'block',
        },
        formGroup: {
            marginRight: 0,
            justifyContent: 'space-between',
            lineHeight: '45px',
        },
    });
};
