import {
    Typography,
    Box,
    Chip,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Report from '../../models/Report';
import { useState } from 'react';

interface ReportAccordionProps {
    report: Report;
    onReportDelete: (id: string) => void;
    onAttachmentDelete: (reportId: string, id: string) => void;
    mode: 'edit' | 'view';
}

const ReportAccordion = ({ report, onReportDelete, onAttachmentDelete, mode }: ReportAccordionProps) => {
    const isDescriptionLong = report.description.length > 21;
    const [dialogueOpen, setDialogueOpen] = useState<string | boolean>(false);
    const [fileName, setFileName] = useState<string>('');
    const [itemId, setItemId] = useState<string>('');

    const handleReportDelete = (id: string) => {
        setItemId(id);
        setDialogueOpen('report');
    }

    const handleAttachmentDelete = (id: string, fileName: string) => {
        setItemId(id);
        setFileName(fileName);
        setDialogueOpen('attachment');
    }

    return (<Accordion sx={{ width: '100%', minWidth: '400px', maxWidth: '550px' }}>
        <AccordionSummary
            sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={report.id}
            id='panel-header'
        >
            {
                isDescriptionLong
                    ? <>{report.title}</>
                    : (<>
                        <Typography component='span' sx={{ flexShrink: 0, mr: 2 }}>
                            {report.title}
                        </Typography>

                        <Typography sx={{ color: 'text.secondary' }}>{report.description}</Typography>
                    </>)
            }
        </AccordionSummary>
        <AccordionDetails>
            {
                isDescriptionLong
                    ? <Typography
                        style={{
                            wordWrap: 'break-word'
                        }}
                        variant="body1"
                        component="div"
                        textOverflow={'ellipsis'}
                        overflow={'hidden'} >
                        {report.description}
                    </Typography>
                    : <></>
            }
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap'
                }}>
                {
                    report.attachments.map(attachment => {
                        return mode === 'view'
                            ? (<Chip
                                onClick={() => window.location.href = attachment.fileUrl}
                                clickable
                                color='info'
                                label={attachment.name}
                                icon={<InsertDriveFileIcon />}
                            />)
                            : (<Chip
                                clickable
                                color='info'
                                label={attachment.name}
                                icon={<InsertDriveFileIcon />}
                                onDelete={() => handleAttachmentDelete(attachment.id, attachment.fileUrl.replace(/^.*[\\/]/, ''))} />)
                    })
                }
            </Box>
            {
                mode === 'edit'
                    ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={() => handleReportDelete(report.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )
                    : <></>
            }
        </AccordionDetails>
        <Dialog
            open={!!dialogueOpen}
            onClose={() => setDialogueOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
                <Typography variant='h5'>Are you sure you want to delete this {dialogueOpen}?</Typography>
                {
                    dialogueOpen === 'attachment'
                        ? <Typography variant='h6' sx={{ color: 'text.secondary' }}>File: {fileName ? fileName.replace(/^.*[\\/]/, '') : fileName}</Typography>
                        : <></>
                }
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Button
                        variant='outlined'
                        onClick={() => setDialogueOpen(false)}>Keep file</Button>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={() => {
                            (dialogueOpen && dialogueOpen === 'report')
                                ? onReportDelete(report.id)
                                : onAttachmentDelete(report.id, itemId)
                            setDialogueOpen(false)
                        }}>Delete</Button>
                </Box>
            </Box>
        </Dialog>
    </Accordion>)
};

export default ReportAccordion;