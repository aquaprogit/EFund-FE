import React, { useMemo } from 'react';
import { Box, TypographyVariant } from "@mui/material";
import { EditProps } from "./Edit.types";
import styles from "./Edit.module.css";
import Info from "../Info/Info";




const Edit: React.FC<EditProps> = (
    {
        initialName,
        initialEmail,
        handleSaveClick,
    }
) => {
    const info = useMemo(() => [
        {
            initialValue: initialName,
            placeholder: 'Name',
            variant: 'h6' as TypographyVariant,
        },
    ], []);
    return (
        <Box className={styles.info}>
            <Info info={info} updateHandler={handleSaveClick} />
        </Box>
    );
};

export default Edit;