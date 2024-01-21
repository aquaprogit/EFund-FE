import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Jar from "../../models/Jar";
import useInfo from "../../hooks/useInfo";
import { useLocation, useNavigate } from "react-router-dom";
import Monobank from "../../services/api/Monobank/Monobank";
import Fundraisings from "../../services/api/Fundraisings";
import PageWrapper from "../../components/common/PageWrapper";
import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Dialog, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import UploadImage from "../../components/profile/UploadImage/UploadImage";
import LimitedTextField from "../../components/common/LimitedTextField";
import MultiSelectWithChips from '../../components/common/MultiSelectWithChips';
import Tags from '../../services/api/Tags';
import Report from '../../models/Report';
import ReportAccordion from '../../components/common/ReportAccordion';
import FundraisingsReports from '../../services/api/FundraisingsReports/FundraisingsReports';
import AddReport from '../Report/AddReport';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../../contexts/UserContext';

const EditFundraising = () => {
    const defaultImage = 'http://localhost:8080/Uploads/Default/Fundraisings/avatar.png'

    const [imageUrl, setImageUrl] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [monobankJar, setMonobankJar] = useState<string>('');
    const [monobankJarId, setMonobankJarId] = useState('');
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const [defaultTags, setDefaultTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [jars, setJars] = useState<Jar[]>([])
    const [openJarsMenu, setOpenJarsMenu] = useState(null);
    const [reports, setReports] = useState<Report[]>([])
    const { sendNotification } = useInfo()
    const inputFile = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const { state } = useLocation()
    const [dialogueOpen, setDialogueOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { user } = useUser();

    const handleOpenJarsMenu = (event: any) => {
        setOpenJarsMenu(event.currentTarget);
    };

    const handleCloseJarsMenu = () => {
        setOpenJarsMenu(null);
    };

    const getMonobankJars = async () => {
        try {
            const response = await Monobank.getJars();
            if (response) {
                if (response.data) {
                    // @ts-ignore
                    setJars(response.data)
                }
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error')
        }
    }

    const getTags = async () => {
        try {
            setLoading(true)
            const response = await Tags.getTags();
            if (response) {
                setExistingTags(response.map((tag) => tag.name))
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error')
        }
    }

    const handleDeleteReport = async (id: string) => {
        try {
            const response = await FundraisingsReports.deleteReport(id);
            if (response) {
                if (response.error) {
                    sendNotification('error', response.error.message)
                }
                else {
                    const newReports = reports.filter((report) => report.id !== id)
                    setReports(newReports)
                }
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error while deleting report')
        }
    }

    const handleDeleteAttachment = async (reportId: string, id: string) => {
        try {
            const response = await FundraisingsReports.deleteAttachment(reportId, id);
            if (response) {
                if (response.error) {
                    sendNotification('error', response.error.message)
                }
                else {
                    const newReports = reports.map((report) => {
                        if (report.id === reportId) {
                            const newAttachments = report.attachments.filter((attachment) => attachment.id !== id)
                            return {
                                ...report,
                                attachments: newAttachments
                            }
                        }
                        return report
                    })
                    setReports(newReports)
                }
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error while deleting attachment')
        }
    }

    const uploadImage = async (fundraisingId: string, file: File) => {
        try {
            const response = await Fundraisings.uploadImage(fundraisingId, file)
            if (response.error) {
                sendNotification('error', response.error.message)
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error while uploading image')
        }
    }
    const handleUploadFundraisingAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const { files } = e.target;
            if (files && files.length) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target) {
                        setImageUrl(event.target.result as string);
                    }
                };
                reader.readAsDataURL(files[0]);
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error while adding fundraising image')
        }
    }
    const handleDeleteFundraisingAvatar = async () => {
        setImageUrl(defaultImage)
        if (inputFile.current) {
            inputFile.current.value = '';
            inputFile.current.files = new DataTransfer().files;
        }
        await Fundraisings.deleteImage(state.id)
    }
    const onSubmit = async () => {
        const requestBody = {
            title,
            description,
            monobankJarId,
            tags: selectedTags,
        }
        try {
            const response = await Fundraisings.updateFundraising(state.id, requestBody)
            if (response) {
                if (response.error) {
                    sendNotification('error', response.error.message)
                }
                else {
                    const fundraisingId = response.data!.id
                    const files = inputFile.current?.files

                    if (files && files.length > 0) {
                        await uploadImage(fundraisingId, files[0])
                    }
                    sendNotification('success', 'Fundraising has been successfully edited')
                    navigate('/my-fundraisings')

                }
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error while editing fundraising')
        }
    }
    const fetchData = async () => {
        try {
            const { avatarUrl, title, description, monobankJarId, monobankJar, tags, reports } = (await Fundraisings.getFundraising(state.id))!
            setImageUrl(avatarUrl)
            setTitle(title)
            setDescription(description)
            setMonobankJarId(monobankJarId)
            setMonobankJar(monobankJar.title)
            setReports(reports)
            setDefaultTags(tags)
            setLoading(false)
        }
        catch (e) {
            sendNotification('error', 'Unexpected error')
            setLoading(false)
        }

    }

    useEffect(() => {
        if (defaultTags) {
            setSelectedTags(defaultTags)
        }
    }, [defaultTags]);

    useEffect(() => {
        getTags();
        getMonobankJars()
        fetchData()
    }, []);

    return (
        <PageWrapper>
            {user
                ? (<Box className='content-wrapper'>
                    <Card style={{
                        marginTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '25px',
                        paddingLeft: '20px',
                        height: '100%',
                        width: 800,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <Typography variant='h5'>Edit Fundraising</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '15px',
                        }}>
                            <UploadImage
                                inputFile={inputFile}
                                handleFileUpload={handleUploadFundraisingAvatar}
                                handleDeleteFile={handleDeleteFundraisingAvatar}
                                url={imageUrl}
                            />
                            <CardContent style={{
                                flexGrow: 1,
                                padding: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                gap: 5
                            }}>

                                <LimitedTextField
                                    label="Title"
                                    maxChar={50}
                                    value={title}
                                    fullWidth
                                    onChange={(value) => setTitle(value)}
                                />
                                <LimitedTextField
                                    label="Description"
                                    maxRows={3}
                                    maxChar={500}
                                    fullWidth
                                    value={description}
                                    onChange={(value) => setDescription(value)}
                                    multiline
                                />
                                <FormControl sx={{ m: 1, ml: 0, minWidth: 200 }} size="small">
                                    <InputLabel id="demo-select-small-label">Monobank jar</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={monobankJar}
                                        label="Monobank jar"
                                        onChange={(e) => setMonobankJar(e.target.value)}
                                        open={Boolean(openJarsMenu)}
                                        onClose={handleCloseJarsMenu}
                                        onOpen={handleOpenJarsMenu}
                                    >
                                        {jars && jars.map((jar) => (
                                            <MenuItem
                                                key={jar.title}
                                                value={jar.title}
                                                onClick={() => setMonobankJarId(jar.id)}
                                            >
                                                {jar.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <MultiSelectWithChips
                                    freeSolo
                                    width='400px'
                                    limitTags={2}
                                    label="Tags"
                                    defaultValues={defaultTags}
                                    values={existingTags}
                                    onChange={(newTags) => setSelectedTags(newTags)}
                                />
                                <Typography variant={'h6'}>Reports:</Typography>
                                <Box>
                                    <Button
                                        startIcon={<AddIcon />}
                                        sx={{
                                            mb: 2,
                                        }}
                                        variant='contained'
                                        size={'medium'}
                                        onClick={() => setDialogueOpen(true)}>
                                        Add report
                                    </Button>
                                    {reports.map((report) => (
                                        <ReportAccordion
                                            report={report}
                                            mode={'edit'}
                                            onReportDelete={handleDeleteReport}
                                            onAttachmentDelete={handleDeleteAttachment}
                                        />
                                    ))}
                                </Box>

                            </CardContent>
                        </Box>
                        <Box
                            mt={3}
                            display={'flex'}
                            width='100%'
                            justifyContent={'center'}>
                            <Button
                                variant='contained'
                                size={'medium'}
                                onClick={onSubmit}>
                                Save
                            </Button>
                        </Box>
                    </Card>
                    <Dialog
                        fullWidth
                        open={dialogueOpen}
                    >
                        <AddReport
                            onClose={async () => {
                                const { reports } = (await Fundraisings.getFundraising(state.id))!
                                setReports(reports)
                                setDialogueOpen(false);
                            }}
                            fundraisingId={state.id}
                        />
                    </Dialog>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Box>
                )
                : (<>{navigate('/')}</>)
            }
        </PageWrapper >
    );
};

export default EditFundraising;