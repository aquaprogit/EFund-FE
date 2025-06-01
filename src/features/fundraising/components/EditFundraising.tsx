import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Jar from "../../monobank/models/Jar";
import { useToast } from "../../../contexts/ToastContext";
import { useLocation, useNavigate } from "react-router-dom";
import { fundraisingsRepository } from '../repository/fundraisingsRepository';
import PageWrapper from "../../../shared/components/PageWrapper";
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Divider,
    Stack
} from "@mui/material";
import UploadImage from "../../users/components/UploadImage";
import LimitedTextField from "../../../shared/components/LimitedTextField";
import MultiSelectWithChips from '../../../shared/components/MultiSelectWithChips';
import { tagsRepository } from '../../tags/repository/tagsRepository';
import Report from '../../reports/models/Report';
import ReportAccordion from '../../reports/components/ReportAccordion';
import AddReport from '../../reports/components/AddReport';
import AddIcon from '@mui/icons-material/Add';
import { useUser } from '../../../contexts/UserContext';
import { monobankRepository } from '../../monobank/repository/monobankRepository';
import { fundraisingsReportsRepository } from '../../reports/repository/fundraisingsReportsRepository';
import { Tag } from '../../tags/models/Tag';

const EditFundraising = ({ fundraisingId }: { fundraisingId: string }) => {
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
    const { showError, showSuccess } = useToast();
    const inputFile = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [dialogueOpen, setDialogueOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [createdByUserId, setCreatedByUserId] = useState<string>('');
    const { user, loading: userLoading } = useUser();

    const handleOpenJarsMenu = (event: any) => {
        setOpenJarsMenu(event.currentTarget);
    };

    const handleCloseJarsMenu = () => {
        setOpenJarsMenu(null);
    };

    const getMonobankJars = async () => {
        const response = await monobankRepository.getJars();
        if (response && response.data) {
            setJars(response.data)
        }
        else {
            showError(response?.error?.message || 'Unexpected error')
        }
    }

    const getTags = async () => {
        try {
            setLoading(true)
            const response = await tagsRepository.getTags();
            if (response && response.data) {
                setExistingTags(response.data.map((tag: Tag) => tag.name))
            }
        }
        catch (e) {
            showError('Unexpected error')
        }
    }

    const handleDeleteReport = async (id: string) => {
        try {
            const response = await fundraisingsReportsRepository.deleteReport(id);
            if (response) {
                if (response.error) {
                    showError(response.error.message)
                }
                else {
                    const newReports = reports.filter((report) => report.id !== id)
                    setReports(newReports)
                }
            }
        }
        catch (e) {
            showError('Unexpected error while deleting report')
        }
    }

    const handleDeleteAttachment = async (reportId: string, id: string) => {
        try {
            const response = await fundraisingsReportsRepository.deleteAttachment(reportId, id);
            if (response) {
                if (response.error) {
                    showError(response.error.message)
                }
                else {
                    const newReports = reports.map((report) => {
                        if (report.id === reportId) {
                            const newAttachments = report.attachments.filter((attachment: any) => attachment.id !== id)
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
            showError('Unexpected error while deleting attachment')
        }
    }

    const uploadImage = async (fundraisingId: string, file: File) => {
        try {
            const response = await fundraisingsRepository.uploadImage(fundraisingId, file)
            if (response.error) {
                showError(response.error.message)
            }
        }
        catch (e) {
            showError('Unexpected error while uploading image')
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
            showError('Unexpected error while adding fundraising image')
        }
    }
    const handleDeleteFundraisingAvatar = async () => {
        setImageUrl(defaultImage)
        if (inputFile.current) {
            inputFile.current.value = '';
            inputFile.current.files = new DataTransfer().files;
        }
        await fundraisingsRepository.deleteImage(fundraisingId)
    }
    const onSubmit = async () => {
        const requestBody = {
            title,
            description,
            monobankJarId,
            tags: selectedTags,
        }
        try {
            const response = await fundraisingsRepository.updateFundraising(fundraisingId, requestBody)
            if (response) {
                if (response.error) {
                    showError(response.error.message)
                }
                else {
                    const fundraisingId = response.data!.id
                    const files = inputFile.current?.files

                    if (files && files.length > 0) {
                        await uploadImage(fundraisingId, files[0])
                    }
                    showSuccess('Fundraising has been successfully edited')
                    navigate(`/fundraising/${fundraisingId}`)
                }
            }
        }
        catch (e) {
            showError('Unexpected error while editing fundraising')
        }
    }
    const fetchData = async () => {
        try {
            const response = await fundraisingsRepository.getFundraising(fundraisingId)

            if (!response || !response.data) {
                showError(response?.error?.message || 'Unexpected error while fetching fundraising')
                setLoading(false)
                return
            }

            const { avatarUrl, title, description, monobankJarId, monobankJar, tags, reports, userId } = response.data

            setImageUrl(avatarUrl)
            setTitle(title)
            setDescription(description)
            setMonobankJarId(monobankJarId)
            setMonobankJar(monobankJar.title)
            setReports(reports)
            setDefaultTags(tags)
            setLoading(false)
            setCreatedByUserId(userId)
        }
        catch (e) {
            showError('Unexpected error')
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

    useEffect(() => {
        if (!userLoading && createdByUserId && !loading && user) {
            if (user.id !== createdByUserId) {
                showError('You are not allowed to edit this fundraising')
                navigate(`/fundraising/${fundraisingId}`)
            }
        }
    }, [user, createdByUserId, userLoading, loading])

    return (
        <PageWrapper>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        overflow: 'visible'
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            textAlign="center"
                            gutterBottom
                            sx={{
                                fontWeight: 600,
                                color: 'primary.main',
                                mb: 4
                            }}
                        >
                            Edit Fundraising
                        </Typography>

                        <Stack spacing={4}>
                            {/* Image and Basic Info Section */}
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 3,
                                alignItems: { xs: 'center', md: 'flex-start' }
                            }}>
                                <UploadImage
                                    inputFile={inputFile}
                                    handleFileUpload={handleUploadFundraisingAvatar}
                                    handleDeleteFile={handleDeleteFundraisingAvatar}
                                    url={imageUrl}
                                />

                                <Stack spacing={3} sx={{ flex: 1, width: '100%' }}>
                                    <LimitedTextField
                                        label="Title"
                                        maxChar={70}
                                        value={title}
                                        fullWidth
                                        onChange={(value) => setTitle(value)}
                                    />

                                    <LimitedTextField
                                        label="Description"
                                        maxRows={4}
                                        maxChar={500}
                                        fullWidth
                                        value={description}
                                        onChange={(value) => setDescription(value)}
                                        multiline
                                    />

                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Monobank Jar</InputLabel>
                                        <Select
                                            value={monobankJar}
                                            label="Monobank Jar"
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
                                        width="100%"
                                        limitTags={3}
                                        label="Tags"
                                        defaultValues={defaultTags}
                                        values={existingTags}
                                        onChange={(newTags) => setSelectedTags(newTags)}
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Reports Section */}
                            <Box>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        mb: 3
                                    }}
                                >
                                    Reports
                                </Typography>

                                <Stack spacing={2}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        size="large"
                                        onClick={() => setDialogueOpen(true)}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            alignSelf: 'flex-start'
                                        }}
                                    >
                                        Add Report
                                    </Button>

                                    {reports.map((report) => (
                                        <ReportAccordion
                                            key={report.id}
                                            report={report}
                                            mode={'edit'}
                                            onReportDelete={handleDeleteReport}
                                            onAttachmentDelete={handleDeleteAttachment}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Action Buttons */}
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                pt: 2
                            }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={onSubmit}
                                    sx={{
                                        minWidth: 200,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={dialogueOpen}
                    PaperProps={{
                        sx: { borderRadius: 2 }
                    }}
                >
                    <AddReport
                        onClose={async () => {
                            const response = await fundraisingsRepository.getFundraising(fundraisingId)
                            if (response) {
                                if (response.data) {
                                    setReports(response.data.reports)
                                }
                            }
                            setDialogueOpen(false);
                        }}
                        fundraisingId={fundraisingId}
                    />
                </Dialog>

                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1
                    }}
                    open={loading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </PageWrapper>
    );
};

export default EditFundraising;