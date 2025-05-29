import { Box, Button, Card, Container, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/pages/fundraising/add-page.css';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import LimitedTextField from "../../components/common/LimitedTextField";
import { monobankRepository } from "../../repository/monobankRepository";
import Jar from "../../models/Jar";
import { useToast } from "../../contexts/ToastContext";
import UploadImage from "../../components/UploadImage";
import fundraisingsRepository from "../../repository/fundraisingsRepository";
import { useNavigate } from "react-router-dom";
import MultiSelectWithChip from "../../components/common/MultiSelectWithChips";
import tagsRepository from "../../repository/tagsRepository";
import { useUser } from "../../contexts/UserContext";
import { useZodForm } from "../../hooks/useZodForm";
import { createFundraisingSchema } from "../../schemas/fundraising/createFundraisingSchema";

const AddPage = () => {
    const theme = useTheme();
    const defaultImage = 'http://localhost:8080/Uploads/Default/Fundraisings/avatar.png'
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [jars, setJars] = useState<Jar[]>([])
    const [openJarsMenu, setOpenJarsMenu] = useState(null);
    const [tags, setTags] = useState<string[]>([]);
    const { showError, showSuccess } = useToast();
    const inputFile = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const { user } = useUser();

    const { register, handleSubmit, setValue, formState: { errors }, watch } = useZodForm(createFundraisingSchema);
    const selectedTags = watch('tags') || [];

    const handleOpenJarsMenu = (event: any) => {
        setOpenJarsMenu(event.currentTarget);
    };

    const handleCloseJarsMenu = () => {
        setOpenJarsMenu(null);
    };

    const getMonobankJars = async () => {
        try {
            const response = await monobankRepository.getJars();
            if (response) {
                if (response.data) {
                    // @ts-ignore
                    setJars(response.data)
                }
            }
        }
        catch (e) {
            showError('Unexpected error')
        }
    }

    const getTags = async () => {
        try {
            const response = await tagsRepository.getTags();
            if (response) {
                setTags(response.map((tag) => tag.name))
            }
        }
        catch (e) {
            showError('Unexpected error')
        }
    }

    const handleTagsChange = (newTags: Array<string>) => {
        setValue('tags', newTags);
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

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
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

    const handleDeleteFile = () => {
        setImageUrl(defaultImage)
        if (inputFile.current) {
            inputFile.current.value = '';
            inputFile.current.files = new DataTransfer().files;
        }
    }

    const onSubmit = async (data: { title: string, description: string, monobankJarId: string, tags?: string[] | undefined }) => {
        try {
            const response = await fundraisingsRepository.createFundraising({
                title: data.title,
                description: data.description,
                monobankJarId: data.monobankJarId,
                tags: data.tags || []
            })
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
                    showSuccess('Fundraising has been successfully created')
                    navigate('/')
                }
            }
        }
        catch (e) {
            showError('Unexpected error while creating fundraising')
        }
    }

    useEffect(() => {
        getMonobankJars();
        getTags();
    }, []);

    return (
        <PageWrapper>
            {user && user.hasMonobankToken ? (
                <Container maxWidth="md" sx={{ py: 4 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Typography
                            variant="h4"
                            textAlign="center"
                            sx={{
                                mb: 4,
                                fontWeight: 600,
                                color: theme.palette.text.primary
                            }}
                        >
                            Create Fundraising
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 3,
                            }}
                        >
                            <UploadImage
                                inputFile={inputFile}
                                handleFileUpload={handleFileUpload}
                                handleDeleteFile={handleDeleteFile}
                                url={imageUrl}
                            />
                            <Box sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                            }}>
                                <LimitedTextField
                                    label="Title"
                                    maxChar={70}
                                    value={watch('title') || ''}
                                    onChange={(value) => setValue('title', value)}
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                                <LimitedTextField
                                    label="Description"
                                    maxChar={500}
                                    value={watch('description') || ''}
                                    onChange={(value) => setValue('description', value)}
                                    multiline
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                                <FormControl fullWidth error={!!errors.monobankJarId}>
                                    <InputLabel id="monobank-jar-label">Monobank Jar</InputLabel>
                                    <Select
                                        labelId="monobank-jar-label"
                                        id="monobank-jar"
                                        value={watch('monobankJarId') || ''}
                                        label="Monobank Jar"
                                        onChange={(e) => setValue('monobankJarId', e.target.value)}
                                        open={Boolean(openJarsMenu)}
                                        onClose={handleCloseJarsMenu}
                                        onOpen={handleOpenJarsMenu}
                                        sx={{
                                            borderRadius: 1,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.divider,
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            }
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                elevation: 0,
                                                sx: {
                                                    maxHeight: 300,
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    borderRadius: 1,
                                                    mt: 1,
                                                    '& .MuiMenuItem-root': {
                                                        py: 1,
                                                        px: 2,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.action.hover,
                                                        },
                                                        '&.Mui-selected': {
                                                            backgroundColor: theme.palette.primary.light,
                                                            '&:hover': {
                                                                backgroundColor: theme.palette.primary.light,
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {jars && jars.map((jar) => (
                                            <MenuItem
                                                key={jar.title}
                                                value={jar.id}
                                            >
                                                {jar.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.monobankJarId && (
                                        <FormHelperText>{errors.monobankJarId.message}</FormHelperText>
                                    )}
                                </FormControl>
                                <Box sx={{ position: 'relative', width: '100%' }}>
                                    <MultiSelectWithChip
                                        label='Tags'
                                        width="100%"
                                        values={tags}
                                        freeSolo
                                        limitTags={2}
                                        value={selectedTags}
                                        onChange={handleTagsChange}
                                    />
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        mt: 2,
                                        py: 1.5,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Create Fundraising
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Container>
            ) : (
                <>{navigate('/')}</>
            )}
        </PageWrapper>
    );
}

export default AddPage;