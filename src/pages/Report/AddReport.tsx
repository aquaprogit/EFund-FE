import { useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import FundraisingsReports, { AddReportBody } from "../../services/api/FundraisingsReports/FundraisingsReports";
import useInfo from "../../hooks/useInfo";
import FileUpload from 'react-material-file-upload';
import LimitedTextField from '../../components/common/LimitedTextField';

const AddReport = ({ onClose, fundraisingId }: { onClose: () => void, fundraisingId: string }) => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState<Array<File>>([])
    const { sendNotification } = useInfo()
    const createFormData = () => {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append(`files`, file);
        });

        return formData;
    }
    const addReport = async () => {
        try {
            const body: AddReportBody = {
                title,
                description,
                fundraisingId: fundraisingId
            }
            const response: any = await FundraisingsReports.addReport(body)
            if (response) {
                if (response.error) {
                    sendNotification('error', response.error.message)
                }
                else if (response.success) {
                    const formData = createFormData()
                    const attachaments = await FundraisingsReports.addAttachments(response.data.id, formData)
                    if (attachaments!.success) {
                        sendNotification('success', 'Report has been added')
                        onClose()
                    }
                    else if (attachaments!.error) {
                        sendNotification('error', attachaments!.error.message)
                    }
                }
            }
        }
        catch (e: any) {
            sendNotification('error', e.message)
        }
    }
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '20px 10px'
        }}>
            <Typography variant={'h4'}>Adding report</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '30px',
                pb: '10px',
                gap: 1,
                width: '100%',
            }}>
                <LimitedTextField
                    fullWidth
                    placeholder='Title'
                    value={title}
                    onChange={setTitle}
                    maxChar={50} />
                <LimitedTextField
                    label="Description"
                    maxChar={500}
                    maxRows={3}
                    fullWidth
                    value={description}
                    onChange={setDescription}
                    multiline
                />
            </Box>
            <FileUpload
                value={files}
                onChange={setFiles}
                maxFiles={4}
                accept={'.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx'}
                multiple />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '10px',
                width: '100%',
                justifyContent: 'flex-end'
            }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        addReport()
                        onClose()
                    }}>Add</Button>
            </Box>
        </Box>
    );
};

export default AddReport;