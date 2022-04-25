const Styles = {
    box: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& h1': {
            fontWeight: '500',
            fontSize: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0, 0, 0, 0.8)',
        },
        '& form': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
    button: {
        width: '464px',
        height: '36px',
        background: '#424445',
        fontSize: '14px',
        border: 'none',
        marginTop: '30px',
        ':hover': {
            background: '#424445',
        },
    },
    boxDivider: {
        width: '464px',
        display: 'flex',
        flexWrap: 'no',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        margin: '17px auto 13px auto',
    },
    divider: {
        width: '219px',
    },
    form: {
        m: 1,
        width: '464px',
        fontFamily: 'Poppins',
        fontWeight: '500',
        fontSize: '16px',
    },
    entrar: {
        marginTop: '7px',
    },
    submit: {
        width: '464px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

export default Styles;
