import { FormControl, InputLabel, OutlinedInput, Link } from '@mui/material';
import Styles from '../../components/formStyles';
import { Box } from '@mui/system';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import GitHubLoginButton from '../../components/GitHubLoginButton';
import PasswordInput from '../../components/PasswordInput';
import SubmitButton from '../../components/SubmitButton';

function SignIn() {
    interface signInInterface {
        email: string;
        password: string;
    }
    const [values, setValues] = useState<signInInterface>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigation = `${loading ? '' : '/signup'}`;
    const navigate = useNavigate();
    // @ts-ignore
    const auth = JSON.parse(localStorage.getItem('auth'));
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
            navigate('/main');
        } catch {}
    }

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setLoading(true);

        const user: signInInterface = { ...values };

        try {
            const { data } = await api.login(user);
            setAuthData(data);
            navigate('/main');
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
            <GitHubLoginButton pageTitle="Sign In" />
            <form>
                <FormControl
                    sx={Styles.form}
                    variant="outlined"
                    disabled={loading}
                    required
                >
                    <InputLabel>Email</InputLabel>
                    <OutlinedInput
                        name="email"
                        label="Email"
                        type="text"
                        value={values.email}
                        onChange={handleChange}
                        required
                    />
                </FormControl>
                <PasswordInput
                    name="password"
                    label="Password"
                    value={values.password}
                    onChange={handleChange}
                />

                <Box sx={Styles.submit}>
                    <Link
                        sx={{
                            cursor: `${loading ? 'not-allowed' : 'pointer'}`,
                            fontSize: '12px',
                        }}
                        underline="always"
                        onClick={() => navigate(navigation)}
                    >
                        {'Sign Up'}
                    </Link>
                    <SubmitButton
                        loading={loading}
                        name="Sign In"
                        handleSubmit={handleSubmit}
                    />
                </Box>
            </form>
        </Box>
    );
}

export default SignIn;
