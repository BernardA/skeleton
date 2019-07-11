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
            fontSize: '12px',
            marginTop: '10px',
        },
        content: {
            maxWidth: '350px',
            margin: '40px auto',
            padding: 0,
        },
    });
};