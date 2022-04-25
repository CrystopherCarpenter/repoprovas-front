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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

function Signup() {
    interface valuesInterface {
        email: string;
        password: string;
        confPassword: string;
    }
    type userInterface = Omit<valuesInterface, 'confPassword'>;
    const [values, setValues] = useState<valuesInterface>({
        email: '',
        password: '',
        confPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigation = `${loading ? '' : '/'}`;
    const navigate = useNavigate();

    function handleChange(prop: string, target: { value: string }) {
        setValues({ ...values, [prop]: target.value });
    }

    function handleClickShowPassword(set: any, state: any) {
        set(!state);
    }

    function handleMouseDownPassword(event: React.SyntheticEvent) {
        event.preventDefault();
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setLoading(true);

        if (values.confPassword !== values.password) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: "Passwords don't match! Try again",
            });
            return;
        }

        const user: userInterface = { ...values };

        try {
            await api.createUser(user);
            navigate('/');
            setLoading(false);
        } catch (error: any) {
            if (error?.response?.status === 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ops!',
                    text: 'Email already in use',
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
            <h1>Cadastro</h1>
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
                                    onClick={() =>
                                        handleClickShowPassword(
                                            setShowPassword,
                                            showPassword
                                        )
                                    }
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
                <FormControl
                    sx={Styles.form}
                    variant="outlined"
                    disabled={loading}
                    required
                >
                    <InputLabel>Confirme sua senha</InputLabel>
                    <OutlinedInput
                        label="Confirme sua senha"
                        type={showConfPassword ? 'text' : 'password'}
                        value={values.confPassword}
                        onChange={({ target }) =>
                            handleChange('confPassword', target)
                        }
                        required
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() =>
                                        handleClickShowPassword(
                                            setShowConfPassword,
                                            showConfPassword
                                        )
                                    }
                                    onMouseDown={(e) =>
                                        handleMouseDownPassword(e)
                                    }
                                    edge="end"
                                >
                                    {showConfPassword ? (
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
                        {'Já possuo cadastro'}
                    </Link>
                    <Button
                        sx={Styles.entrar}
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Cadastrar
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default Signup;
