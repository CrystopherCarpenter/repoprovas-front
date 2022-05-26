import { Button, Divider } from '@mui/material';
import { Box } from '@mui/system';
import Styles from '../../components/formStyles';

interface Props {
    pageTitle: string;
}

function GitHubLoginButton({ pageTitle }: Props) {
    return (
        <>
            <h1>{pageTitle}</h1>
            <Button variant="contained" sx={Styles.button}>
                Sign In with GitHub
            </Button>
            <Box sx={Styles.boxDivider}>
                <Divider sx={Styles.divider}></Divider>
                <p>or</p>
                <Divider sx={Styles.divider}></Divider>
            </Box>
        </>
    );
}

export default GitHubLoginButton;
