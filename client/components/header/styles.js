
export default () => {
    return ({
        headerTop: {
            display: 'grid',
            gridTemplateColumns: '190px auto',
            backgroundColor: '#2d5074',
            height: '60px',
        },
        branding: {
            justifySelf: 'start',
            width: '190px',
        },
        status: {
            justifySelf: 'end',
        },
        statusUser: {
            width: '65px',
            display: 'block',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
        signer: {
            '& button': {
                fontWeight: '600',
                width: '65px',
                color: '#fff',
                height: '60px',
                fontSize: '12px',
                flexDirection: 'column',
            },
            '& a': {
                fontWeight: '600',
                width: '65px',
                color: '#fff',
                height: '60px',
                fontSize: '12px',
                flexDirection: 'column',
            },
            '& div:first-child': {
                borderLeftColor: '#ccc',
            },
        },
        welcome: {
            justifyContent: 'space-evenly',
        },
        nav: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(60px, auto))',
            padding: '0 10px 0 0',
            backgroundColor: '#fff',
            '& a': {
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: '#445565',
            },
            '& li': {
                padding: '0 5px 0',
                fontWeight: '700',
                fontSize: '0.8rem',
                height: '35px',
            },
        },
    });
};
