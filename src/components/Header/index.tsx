import { Box } from '@mui/system';
import img from '../../assets/logo.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import api from '../../services/api';
import Swal from 'sweetalert2';

function Header() {
    const { pathname } = useLocation();
    let centeredLogo = pathname === '/' || pathname === '/signup';
    const auth = JSON.parse(localStorage.getItem('auth') || '');
    const navigate = useNavigate();
    const styles = {
        width: '100vw',
        height: '170px',
        alignItems: 'center',
        justifyContent: `${centeredLogo ? 'center' : 'space-between'}`,
        display: 'flex',
        background: '#fff',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '10',
        paddingLeft: `${centeredLogo ? '0' : '80px'}`,
        '& img': {
            width: '292px',
        },
        '& div': {
            display: `${centeredLogo ? 'none' : 'flex'}`,
            position: 'fixed',
            right: '33px',
            top: '37px',
            cursor: 'pointer',
        },
    };

    async function logout() {
        try {
            await api.logout(auth);
            localStorage.clear();
            navigate(`/`);
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Ops!',
                text: 'Ocorreu um erro, tente novamente',
            });
        }
    }

    return (
        <Box sx={styles}>
            <img src={img} alt={'RepoProvas'} />
            <IconContext.Provider value={{ color: 'black', size: '2em' }}>
                <div>
                    <RiLogoutBoxRLine onClick={() => logout()} />
                </div>
            </IconContext.Provider>
        </Box>
    );
}

export default Header;
