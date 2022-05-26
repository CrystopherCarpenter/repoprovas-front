import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    SxProps,
    Theme,
} from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import Styles from '../formStyles';

interface Props {
    name: string;
    label: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({ name, label, value, onChange }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    function handleIconClick() {
        setShowPassword(!showPassword);
    }

    return (
        <FormControl sx={Styles.form} variant="outlined">
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                required
                id={name}
                name={name}
                type={showPassword ? 'text' : 'password'}
                value={value}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleIconClick}
                            onMouseDown={handleIconClick}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
            />
        </FormControl>
    );
}

export default PasswordInput;
