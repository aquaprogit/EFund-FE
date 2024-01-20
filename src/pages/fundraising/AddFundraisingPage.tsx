import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import PageWrapper from "../../components/common/PageWrapper";
import '../../styles/pages/fundraising/add-page.css';
import { useState } from "react";
import LimitedTextField from "../../components/common/LimitedTextField";
// import ChipsInput from "../../components/common/ChipsInput";
import React from "react";

const AddPage = () => {
    const [imageUrl, setImageUrl] = useState<string>('http://localhost:8080/Uploads/Default/Fundraisings/avatar.png');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [monobankJar, setMonobankJar] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);

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
                    <CardMedia
                        component="img"
                        sx={{
                            width: 175,
                            height: 175,
                            objectFit: 'initial',
                        }}
                        image={imageUrl}
                        alt={'Fundraising Avatar'}
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
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                            </Select>
                        </FormControl>
                        {/* <ChipsInput selectedValues={tags} setSelectedValues={setTags} /> */}
                    </CardContent>
                </Card>
            </Box>
        </PageWrapper>
    );
}

export default AddPage;