import {
    Button,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Styles from '../../components/formStyles';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

function Login() {
    interface loginInterface {
        email: string;
        password: string;
    }
    const [values, setValues] = useState<loginInterface>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = `${loading ? '' : '/signup'}`;
    const navigate = useNavigate();
    const auth = JSON.parse(localStorage.getItem('auth') || '');
    const { setAuthData } = useAuth();

    useEffect(() => {
        if (auth && auth !== '') {
            authValidation();
        }
        // eslint-disable-next-line
    }, []);

    async function authValidation() {
        try {
            await api.authToken(auth.token);
            navigate('/timeline');
        } catch {}
    }

    function handleChange(prop: string, target: { value: string }) {
        setValues({ ...values, [prop]: target.value });
    }

    function handleClickShowPassword() {
        setShowPassword(!showPassword);
    }

    function handleMouseDownPassword(event: React.SyntheticEvent) {
        event.preventDefault();
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setLoading(true);

        const user: loginInterface = { ...values };

        try {
            const { data } = await api.login(user);
            localStorage.setItem('auth', JSON.stringify(data));
            setAuthData(data);
            navigate('/repo');
        } catch (error: any) {
            if (error?.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Email or password incorrect',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Something went wrong! Try again',
                });
            }
            setLoading(false);
        }
    }

    return (
        <Box sx={Styles.box}>
            <h1>Login</h1>
            <Button variant="contained" sx={Styles.button}>
                Entrar com o GitHub
            </Button>
            <Box sx={Styles.boxDivider}>
                <Divider sx={Styles.divider}></Divider>
                <p>ou</p>
                <Divider sx={Styles.divider}></Divider>
            </Box>
            <form>
                <FormControl
                    sx={Styles.form}
                    variant="outlined"
                    disabled={loading}
                    required
                >
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput
                        label="Email"
                        type="text"
                        value={values.email}
                        onChange={({ target }) => handleChange('email', target)}
                        required
                    />
                </FormControl>
                <FormControl
                    sx={Styles.form}
                    variant="outlined"
                    disabled={loading}
                    required
                >
                    <InputLabel>Senha</InputLabel>
                    <OutlinedInput
                        label="Senha"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={({ target }) =>
                            handleChange('password', target)
                        }
                        required
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleClickShowPassword()}
                                    onMouseDown={(e) =>
                                        handleMouseDownPassword(e)
                                    }
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOffIcon />
                                    ) : (
                                        <VisibilityIcon />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Box sx={Styles.submit}>
                    <Link
                        sx={{
                            cursor: `${loading ? 'not-allowed' : 'pointer'}`,
                            fontSize: '12px',
                        }}
                        underline="always"
                        onClick={() => navigate(navigation)}
                    >
                        {'Não possuo cadastro'}
                    </Link>
                    <Button
                        sx={Styles.entrar}
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Entrar
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default Login;
