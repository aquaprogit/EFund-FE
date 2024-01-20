import React from 'react';
import {Box, Button, Typography} from "@mui/material";
import FundraisingsReports from "../../services/api/FundraisingsReports/FundraisingsReports";
import useInfo from "../../hooks/useInfo";
import {useNavigate} from "react-router-dom";

type AttachmentProps = {
    fileUrl: string,
    id: string,
    name: string,
};

export type ReportProps = {
    id: string,
    title: string,
    description: string,
    fundraisingId: string,
    attachments: Array<AttachmentProps>,
    setReports: Function,
    reports: Array<ReportProps>,
};

const Attachment: React.FC<AttachmentProps> = ({ fileUrl, id, name }) => {
    const isImage = fileUrl.match(/\.(jpeg|jpg|gif|png)$/) != null;

    return (
        <Box>
            {isImage ? (
                <img src={fileUrl} alt={name} style={{ maxWidth: '100%', maxHeight: '300px' }} />
            ) : (
                <Box>
                    <a href={fileUrl} download>
                        {name}
                    </a>
                </Box>
            )}
        </Box>
    );
};

const Report: React.FC<ReportProps> = ({
   id,
   title,
   description,
   fundraisingId,
   attachments,
    setReports,
    reports
}) => {
    const {addInfo} = useInfo()
    const navigate = useNavigate()
    const deleteReport = async () => {
        const response = await FundraisingsReports.deleteReport(id)
        const newReports = reports.filter(report => report.id !== id)
        setReports(newReports)
        if (response) {
            if (response.error) {
                addInfo('error', response.error.message)
            }
        }
    }
    const editReport =  () => {
        navigate('/edit-report', {state: {fundraisingId: fundraisingId}})
    }
    return (
        <Box>
            <Typography variant={'h2'}>{title}</Typography>
            <Typography>{description}</Typography>

            <Typography variant={'h3'}>Attachments:</Typography>
            {attachments.map((attachment) => (
                <Attachment key={attachment.id} {...attachment} />
            ))}
            <Button onClick={deleteReport}>Delete</Button>
            <Button onClick={editReport}>Edit</Button>
        </Box>
    );
};

export default Report;
