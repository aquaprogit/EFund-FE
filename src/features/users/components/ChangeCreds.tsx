import React from 'react';
import { Box, Button, Typography } from "@mui/material";
import styles from './ChangeCreds.module.css';


type ChangeCredsProps = {
    title: string,
    buttonLabel: string,
    children: React.ReactNode,
    buttonHandler: React.MouseEventHandler<HTMLButtonElement>,
}

const ChangeCreds: React.FC<ChangeCredsProps> = (
    {
        title,
        buttonLabel,
        children,
        buttonHandler,
    }
) => {
    return (
        <Box className={styles.container}>
            <Typography variant={'h5'}>{title}</Typography>
            {children}
            <Button size={'large'} onClick={buttonHandler}>{buttonLabel}</Button>
        </Box>
    );
};

export default ChangeCreds;