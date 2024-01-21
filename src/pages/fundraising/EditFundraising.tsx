import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Jar from "../../models/Jar";
import useInfo from "../../hooks/useInfo";
import { useLocation, useNavigate } from "react-router-dom";
import Monobank from "../../services/api/Monobank/Monobank";
import Fundraisings from "../../services/api/Fundraisings";
import PageWrapper from "../../components/common/PageWrapper";
import { Box, Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Skeleton, Typography } from "@mui/material";
import UploadImage from "../../components/profile/UploadImage/UploadImage";
import LimitedTextField from "../../components/common/LimitedTextField";
import ReportSection from "../../components/Reports/ReportSection";
import MultiSelectWithChips from '../../components/common/MultiSelectWithChips';
import Tags from '../../services/api/Tags';


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
    const [reports, setReports] = useState([])
    const { sendNotification: addInfo } = useInfo()
    const inputFile = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()
    const { state } = useLocation()

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
            const response = await Tags.getTags();
            if (response) {
                setExistingTags(response.map((tag) => tag.name))
            }
        }
        catch (e) {
            sendNotification('error', 'Unexpected error')
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
            sendNotification('error', 'Unexpected error while adding fundraising image')
        }
    }
    const handleDeleteFile = async () => {
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
            addInfo('error', 'Unexpected error while editing fundraising')
        }
    }
    const fetchData = async () => {
        try {
            const {avatarUrl, title, description, monobankJarId, monobankJar, tags, reports} = (await Fundraisings.getFundraising(state.id))!
            setImageUrl(avatarUrl)
            setTitle(title)
            setDescription(description)
            setMonobankJarId(monobankJarId)
            setMonobankJar(monobankJar.title)
            setReports(reports)
            setDefaultTags(tags)
        }
        catch (e) {
            addInfo('error', 'Unexpected error')
        }

    }

    useEffect(() => {
        getTags();
        getMonobankJars()
        fetchData()
    }, []);

    return (
        <PageWrapper>
            <Box className='content-wrapper'>
                <Typography variant='h5'>Edit Fundraising</Typography>
                <Card style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px',
                    padding: '25px',
                    paddingLeft: '20px',
                    height: '100%',
                    width: 800,
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
                            maxChar={50}
                            value={title}
                            fullWidth
                            onChange={(value) => setTitle(value)}
                        />
                        <LimitedTextField
                            label="Description"
                            maxChar={150}
                            fullWidth
                            value={description}
                            onChange={(value) => setDescription(value)}
                            multiline
                        />
                        <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
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
                        <Button size={'large'} onClick={onSubmit}>Edit</Button>
                    </CardContent>
                </Card>
                <Typography variant={'h3'}>Reports</Typography>
                <ReportSection setReports={setReports} reports={reports} fundraisingId={state.id}/>
            </Box>
        </PageWrapper>
    );
};

export default EditFundraising;