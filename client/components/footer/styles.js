export default () => {
    return ({
        root: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gridGap: '15px',
            padding: '20px',
            justifyContent: 'space-evenly',
            backgroundColor: '#2d5074',
        },
        section: {
            textAlign: 'center',
            textTransform: 'uppercase',
            color: '#fff',
            display: 'grid',
            alignContent: 'space-between',
        },
        sectionDiv: {
            display: 'flex',
            flexDirection: 'column',
        },
        sectionP: {
            textTransform: 'none',
            textAlign: 'justify',
            fontSize: '12px',
        },
        sectionDivA: {
            fontWeight: 600,
            height: '40px',
            fontSize: '12px',
        },
        social: {
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        socialImg: {
            width: '60px',
        },
    });
};
