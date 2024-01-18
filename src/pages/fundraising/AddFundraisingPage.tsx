import {
    Box,
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/pages/fundraising/add-page.css';
import {ChangeEvent, useEffect, useRef, useState} from "react";
import LimitedTextField from "../../components/common/LimitedTextField";
import React from "react";
import Monobank from "../../services/api/Monobank/Monobank";
import Jar from "../../models/Jar";
import {MuiChipsInput} from "mui-chips-input";
import useInfo from "../../hooks/useInfo";
import UploadImage from "../../components/profile/UploadImage/UploadImage";
import Fundraisings from "../../services/api/Fundraisings";

const AddPage = () => {
    const [imageUrl, setImageUrl] = useState<string>('http://localhost:8080/Uploads/Default/Fundraisings/avatar.png');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [monobankJar, setMonobankJar] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [jars, setJars] = useState<Jar[]>([])
    const [openJarsMenu, setOpenJarsMenu] = useState(null);
    const [fundraisingId, setFundraisingId] = useState('')
    const {addInfo} = useInfo()
    const inputFile = useRef(null)

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
            addInfo('error', 'Unexpected error')
        }

    }
    const handleTagsChange = (newTags: Array<string>) => {
        setTags(newTags)
    }
    useEffect(() => {
        getMonobankJars()
    }, []);
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
                const response = await Fundraisings.uploadImage(fundraisingId, files[0])
                if (response.error) {
                    addInfo('error', response.error.message)
                }
            }
        }
        catch (e) {
            addInfo('error', 'Unexpected error while adding fundraising image')
        }
    }

    return (
        <PageWrapper>
            <Box className='content-wrapper'>
                <Typography variant='h5'>Creating Fundraising</Typography>
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
                        url={imageUrl}
                    />
                    {/*<CardMedia*/}
                    {/*    component="img"*/}
                    {/*    sx={{*/}
                    {/*        width: 175,*/}
                    {/*        height: 175,*/}
                    {/*        objectFit: 'initial',*/}
                    {/*    }}*/}
                    {/*    image={imageUrl}*/}
                    {/*    alt={'Fundraising UploadImage'}*/}
                    {/*/>*/}
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
                            rows={3}
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
                                    <MenuItem key={jar.title} value={jar.title}>
                                        {jar.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <MuiChipsInput
                            size={'small'}
                            value={tags}
                            onChange={handleTagsChange}
                            placeholder={'Tags'}
                        />
                    </CardContent>
                </Card>
            </Box>
        </PageWrapper>
    );
}

export default AddPage;