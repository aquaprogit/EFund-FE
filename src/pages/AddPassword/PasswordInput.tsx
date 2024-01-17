import React, {useMemo} from 'react';
import TextField from "@mui/material/TextField";
import {Box, InputAdornment, Typography} from "@mui/material";
import styles from './AddPassword.module.css';
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UseFormRegisterReturn } from 'react-hook-form';

type PasswordInputProps = {
    register: UseFormRegisterReturn;
    placeholder: string;
    error: any
};

const PasswordInput: React.FC<PasswordInputProps> = ({
     register,
     placeholder,
    error
}) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const handleClickShowPassword = () => {
        setIsVisible((prevState) => !prevState);
    };

    const inputProps = {
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                >
                    {isVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        ),
    };
    const containerStyle = useMemo(() => {
        return {
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
            alignItems: 'center',
            rowGap: '10px'
        }
    }, [])
    return (
        <Box className={styles.passwordField} sx={containerStyle}>
            <TextField
                type={isVisible ? 'text' : 'password'}
                required={true}
                size={'small'}
                placeholder={placeholder}
                InputProps={inputProps}
                {...register}
                sx={{width: '400px'}}
            />
            {error && <Typography sx={{color: 'red'}}>{error.message}</Typography> }
        </Box>
    );
};

export default PasswordInput;
