import { FormControl, InputLabel, OutlinedInput, Link } from '@mui/material';
import Styles from '../../components/formStyles';
import { Box } from '@mui/system';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import PasswordInput from '../../components/PasswordInput';
import GitHubLoginButton from '../../components/GitHubLoginButton';
import SubmitButton from '../../components/SubmitButton';

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
    const [loading, setLoading] = useState(false);
    const navigation = `${loading ? '' : '/'}`;
    const navigate = useNavigate();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setValues({ ...values, [e.target.name]: e.target.value });
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

        const user: userInterface = {
            email: values.email,
            password: values.password,
        };

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
            <GitHubLoginButton pageTitle="Sign Up" />
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
                <PasswordInput
                    name="confPassword"
                    label="Verify your password"
                    value={values.confPassword}
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
                        {'Sign in'}
                    </Link>
                    <SubmitButton
                        loading={loading}
                        name="Sign up"
                        handleSubmit={handleSubmit}
                    />
                </Box>
            </form>
        </Box>
    );
}

export default Signup;
