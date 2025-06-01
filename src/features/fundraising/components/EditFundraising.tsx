import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Jar from "../../monobank/models/Jar";
import { useToast } from "../../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from '../../auth/store/auth.store';

// Custom hook for fundraising data
const useFundraisingData = (fundraisingId: string) => {
    const [data, setData] = useState({
        imageUrl: '',
        title: '',
        description: '',
        monobankJar: '',
        monobankJarId: '',
        defaultTags: [] as string[],
        reports: [] as Report[],
        createdByUserId: ''
    });
    const [loading, setLoading] = useState(true);
    const { showError } = useToast();

    const fetchFundraisingData = async () => {
        try {
            setLoading(true);
            const response = await fundraisingsRepository.getFundraising(fundraisingId);

            if (!response?.data) {
                showError(response?.error?.message || 'Failed to fetch fundraising data');
                return;
            }

            const { avatarUrl, title, description, monobankJarId, monobankJar, tags, reports, userId } = response.data;

            setData({
                imageUrl: avatarUrl,
                title,
                description,
                monobankJar: monobankJar.title,
                monobankJarId,
                defaultTags: tags,
                reports,
                createdByUserId: userId
            });
        } catch (error) {
            showError('Unexpected error while fetching fundraising');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundraisingData();
    }, [fundraisingId]);

    return { data, loading, refetch: fetchFundraisingData };
};

// Custom hook for monobank jars
const useMonobankJars = () => {
    const [jars, setJars] = useState<Jar[]>([]);
    const { showError } = useToast();

    const fetchJars = async () => {
        try {
            const response = await monobankRepository.getJars();
            if (response?.data) {
                setJars(response.data);
            } else {
                showError(response?.error?.message || 'Failed to fetch Monobank jars');
            }
        } catch (error) {
            showError('Unexpected error while fetching jars');
        }
    };

    useEffect(() => {
        fetchJars();
    }, []);

    return jars;
};

// Custom hook for tags
const useTags = () => {
    const [existingTags, setExistingTags] = useState<string[]>([]);
    const { showError } = useToast();

    const fetchTags = async () => {
        try {
            const response = await tagsRepository.getTags();
            if (response?.data) {
                setExistingTags(response.data.map((tag: Tag) => tag.name));
            }
        } catch (error) {
            showError('Unexpected error while fetching tags');
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return existingTags;
};

// Custom hook for authorization
const useAuthorizationCheck = (createdByUserId: string, fundraisingId: string, loading: boolean) => {
    const { user, loading: userLoading } = useUser();
    const { isAuth } = useAuth();
    const { showError } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuth) {
            showError('You are not allowed to edit this fundraising');
            navigate(`/fundraising/${fundraisingId}`);
        }

        if (!userLoading && createdByUserId && !loading && user) {
            if (user.id !== createdByUserId) {
                showError('You are not allowed to edit this fundraising');
                navigate(`/fundraising/${fundraisingId}`);
            }
        }
    }, [user, createdByUserId, userLoading, loading]);

    return user;
};

interface EditFundraisingProps {
    fundraisingId: string;
}

const EditFundraising = ({ fundraisingId }: EditFundraisingProps) => {
    const defaultImage = 'http://localhost:8080/Uploads/Default/Fundraisings/avatar.png';

    // Custom hooks
    const { data: fundraisingData, loading: dataLoading, refetch } = useFundraisingData(fundraisingId);
    const jars = useMonobankJars();
    const existingTags = useTags();
    const user = useAuthorizationCheck(fundraisingData.createdByUserId, fundraisingId, dataLoading);

    // Local state
    const [formData, setFormData] = useState({
        imageUrl: defaultImage,
        title: '',
        description: '',
        monobankJar: '',
        monobankJarId: '',
        selectedTags: [] as string[]
    });
    const [reports, setReports] = useState<Report[]>([]);
    const [openJarsMenu, setOpenJarsMenu] = useState<null | HTMLElement>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputFile = useRef<HTMLInputElement | null>(null);
    const { showError, showSuccess } = useToast();
    const navigate = useNavigate();

    // Update form data when fundraising data changes
    useEffect(() => {
        if (fundraisingData) {
            setFormData({
                imageUrl: fundraisingData.imageUrl || defaultImage,
                title: fundraisingData.title,
                description: fundraisingData.description,
                monobankJar: fundraisingData.monobankJar,
                monobankJarId: fundraisingData.monobankJarId,
                selectedTags: fundraisingData.defaultTags
            });
            setReports(fundraisingData.reports);
        }
    }, [fundraisingData]);

    // Event handlers
    const handleJarMenuOpen = (event: React.SyntheticEvent) => {
        setOpenJarsMenu(event.currentTarget as HTMLElement);
    };

    const handleJarMenuClose = () => {
        setOpenJarsMenu(null);
    };

    const handleJarSelect = (jarTitle: string, jarId: string) => {
        setFormData(prev => ({
            ...prev,
            monobankJar: jarTitle,
            monobankJarId: jarId
        }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files?.length) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData(prev => ({
                        ...prev,
                        imageUrl: event.target!.result as string
                    }));
                }
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleImageDelete = async () => {
        setFormData(prev => ({ ...prev, imageUrl: defaultImage }));
        if (inputFile.current) {
            inputFile.current.value = '';
            inputFile.current.files = new DataTransfer().files;
        }
        try {
            await fundraisingsRepository.deleteImage(fundraisingId);
        } catch (error) {
            showError('Failed to delete image');
        }
    };

    const handleReportDelete = async (reportId: string) => {
        try {
            const response = await fundraisingsReportsRepository.deleteReport(reportId);
            if (response?.error) {
                showError(response.error.message);
            } else {
                setReports(prev => prev.filter(report => report.id !== reportId));
            }
        } catch (error) {
            showError('Unexpected error while deleting report');
        }
    };

    const handleAttachmentDelete = async (reportId: string, attachmentId: string) => {
        try {
            const response = await fundraisingsReportsRepository.deleteAttachment(reportId, attachmentId);
            if (response?.error) {
                showError(response.error.message);
            } else {
                setReports(prev => prev.map(report => {
                    if (report.id === reportId) {
                        return {
                            ...report,
                            attachments: report.attachments.filter(attachment => attachment.id !== attachmentId)
                        };
                    }
                    return report;
                }));
            }
        } catch (error) {
            showError('Unexpected error while deleting attachment');
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const requestBody = {
                title: formData.title,
                description: formData.description,
                monobankJarId: formData.monobankJarId,
                tags: formData.selectedTags,
            };

            const response = await fundraisingsRepository.updateFundraising(fundraisingId, requestBody);

            if (response?.error) {
                showError(response.error.message);
                return;
            }

            // Upload image if new file is selected
            const files = inputFile.current?.files;
            if (files?.length) {
                await fundraisingsRepository.uploadImage(fundraisingId, files[0]);
            }

            showSuccess('Fundraising has been successfully edited');
            navigate(`/fundraising/${fundraisingId}`);
        } catch (error) {
            showError('Unexpected error while editing fundraising');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportDialogClose = async () => {
        await refetch();
        setDialogOpen(false);
    };

    if (dataLoading) {
        return (
            <PageWrapper>
                <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card elevation={3} sx={{ borderRadius: 2, overflow: 'visible' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            textAlign="center"
                            gutterBottom
                            sx={{ fontWeight: 600, color: 'primary.main', mb: 4 }}
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
                                    handleFileUpload={handleImageUpload}
                                    handleDeleteFile={handleImageDelete}
                                    url={formData.imageUrl}
                                />

                                <Stack spacing={3} sx={{ flex: 1, width: '100%' }}>
                                    <LimitedTextField
                                        label="Title"
                                        maxChar={70}
                                        value={formData.title}
                                        fullWidth
                                        onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                                    />

                                    <LimitedTextField
                                        label="Description"
                                        maxRows={4}
                                        maxChar={500}
                                        fullWidth
                                        value={formData.description}
                                        onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                        multiline
                                    />

                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Monobank Jar</InputLabel>
                                        <Select
                                            value={formData.monobankJar}
                                            label="Monobank Jar"
                                            onChange={(e) => setFormData(prev => ({ ...prev, monobankJar: e.target.value }))}
                                            open={Boolean(openJarsMenu)}
                                            onClose={handleJarMenuClose}
                                            onOpen={handleJarMenuOpen}
                                        >
                                            {jars.map((jar) => (
                                                <MenuItem
                                                    key={jar.id}
                                                    value={jar.title}
                                                    onClick={() => handleJarSelect(jar.title, jar.id)}
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
                                        defaultValues={formData.selectedTags}
                                        values={existingTags}
                                        onChange={(newTags) => setFormData(prev => ({ ...prev, selectedTags: newTags }))}
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
                                    sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}
                                >
                                    Reports
                                </Typography>

                                <Stack spacing={2}>
                                    <Button
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        size="large"
                                        onClick={() => setDialogOpen(true)}
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
                                            mode="edit"
                                            onReportDelete={handleReportDelete}
                                            onAttachmentDelete={handleAttachmentDelete}
                                        />
                                    ))}
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Action Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    sx={{
                                        minWidth: 200,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={dialogOpen}
                    PaperProps={{ sx: { borderRadius: 2 } }}
                >
                    <AddReport
                        onClose={handleReportDialogClose}
                        fundraisingId={fundraisingId}
                    />
                </Dialog>

                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isSubmitting}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
        </PageWrapper>
    );
};

export default EditFundraising;