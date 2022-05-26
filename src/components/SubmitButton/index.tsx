import { Button } from '@mui/material';
import { MouseEventHandler } from 'react';
import Styles from '../formStyles';

interface Props {
    loading: boolean;
    handleSubmit?: MouseEventHandler<HTMLButtonElement>;
    name: string;
}

function SubmitButton({ loading, handleSubmit, name }: Props) {
    return (
        <Button
            sx={Styles.entrar}
            variant="contained"
            disabled={loading}
            type="submit"
            onClick={handleSubmit}
        >
            {name}
        </Button>
    );
}

export default SubmitButton;
