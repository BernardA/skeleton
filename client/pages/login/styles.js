export default () => {
    return ({
        root: {
            margin: '0 auto',
            maxWidth: '550px',
            minHeight: '500px',
        },
        header: {
            maxWidth: '350px',
            margin: '40px auto',
            textAlign: 'center',
        },
        title: {
            textTransform: 'uppercase',
        },
        subheader: {
            marginTop: '20px',
        },
        content: {
            maxWidth: '350px',
            margin: '40px auto',
            padding: 0,
        },
        notMember: {
            margin: '20px 0',
            textAlign: 'center',
        },
        forgotPassword: {
            display: 'block',
            textAlign: 'right',
        },
        container: {
            display: 'flex',
            flexWrap: 'wrap',
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
