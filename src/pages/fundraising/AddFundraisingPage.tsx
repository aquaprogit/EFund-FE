import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography, } from "@mui/material";
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

const AddPage = () => {
    const defaultImage = 'http://localhost:8080/Uploads/Default/Fundraisings/avatar.png'
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [monobankJar, setMonobankJar] = useState<string>('');
    const [monobankJarId, setMonobankJarId] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [jars, setJars] = useState<Jar[]>([])
    const [openJarsMenu, setOpenJarsMenu] = useState(null);
    const { showError, showSuccess } = useToast();
    const inputFile = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const { user } = useUser();

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
        setSelectedTags(newTags)
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
    const onSubmit = async () => {
        const requestBody = {
            title,
            description,
            monobankJarId,
            tags: selectedTags,
        }
        try {
            const response = await fundraisingsRepository.createFundraising(requestBody)
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
            {
                user && user.hasMonobankToken
                    ? (<Box sx={{
                        mt: 10,
                    }} className='content-wrapper'>
                        <Card style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            padding: '25px',
                            paddingLeft: '20px',
                            height: '100%',
                            width: 800,
                        }}>
                            <Typography textAlign={'center'} variant='h5'>Creating Fundraising</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '15px',
                            }}>
                                <UploadImage
                                    inputFile={inputFile}
                                    handleFileUpload={handleFileUpload}
                                    handleDeleteFile={handleDeleteFile}
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
                                        maxChar={70}
                                        value={title}
                                        fullWidth
                                        onChange={(value) => setTitle(value)}
                                    />
                                    <LimitedTextField
                                        label="Description"
                                        maxChar={500}
                                        fullWidth
                                        value={description}
                                        onChange={(value) => setDescription(value)}
                                        multiline
                                    />
                                    <FormControl sx={{ ml: 0, mb: 1, mt: 1, minWidth: 200 }} size="small">
                                        <InputLabel id="monobank-jar-label">Monobank jar</InputLabel>
                                        <Select
                                            labelId="monobank-jar-label"
                                            id="monobank-jar"
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
                                    <MultiSelectWithChip
                                        label='Tags'
                                        width="250px"
                                        values={tags}
                                        freeSolo
                                        limitTags={2}
                                        onChange={handleTagsChange}
                                    />
                                    <Button size={'large'} onClick={onSubmit}>Create</Button>
                                </CardContent>
                            </Box>
                        </Card>
                    </Box>)
                    : <>{navigate('/')}</>
            }
        </PageWrapper >
    );
}

export default AddPage;