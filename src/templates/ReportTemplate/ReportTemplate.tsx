import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import styles from './ReportTemplate.module.css';
import FileUpload from "react-material-file-upload";

type ReportTemplate = {
    title: string,
    setTitle: Function,
    description: string,
    setDescription: Function,
    files: File[],
    setFiles: (files: File[]) => void,
    buttonText: string,
    onClickHandler: React.MouseEventHandler,
    header: string,

}

const ReportTemplate: React.FC<ReportTemplate> = (
    {
        title,
        setTitle,
        description,
        setDescription,
        files,
        setFiles,
        buttonText,
        onClickHandler,
        header,
    }
) => {

    return (
        <Box className={styles.container}>
            <Typography variant={'h3'}>{header}</Typography>
            <TextField
                placeholder={'Title'}
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
            />
            <TextField
                placeholder={'Description'}
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
            />
            <FileUpload value={files} onChange={setFiles} multiple/>
            <Button onClick={onClickHandler}>{buttonText}</Button>
        </Box>

    );
};

export default ReportTemplate;