export default () => {
    return ({
        scroller: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 230px))',
            padding: '10px',
            justifyContent: 'space-evenly'
        },
        conceptImg: {
            maxWidth: '230px',
            margin: '0 auto',
        },
    });
} 
