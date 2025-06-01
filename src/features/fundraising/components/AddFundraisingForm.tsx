import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, Link, MenuItem, Select, useTheme } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { useZodForm } from "../../../shared/hooks/useZodForm";
import { createFundraisingSchema } from "../schemas/createFundraisingSchema";
import LimitedTextField from "../../../shared/components/LimitedTextField";
import MultiSelectWithChip from "../../../shared/components/MultiSelectWithChips";
import UploadImage from "../../users/components/UploadImage";
import Jar from "../../monobank/models/Jar";
import { styles } from "./AddFundraisingPage.styles";
import { Link as RouterLink } from "react-router-dom";

interface AddFundraisingFormData {
    title: string;
    description: string;
    monobankJarId: string;
    tags?: string[];
}

interface AddFundraisingFormProps {
    jars: Jar[];
    availableTags: string[];
    onSubmit: (data: AddFundraisingFormData, imageFile?: File) => Promise<void>;
}

const defaultImage = (process.env.REACT_APP_BACKEND_URL ?? '') + (process.env.REACT_APP_BASE_FUNDRAISING_IMG_URL ?? '/Uploads/Default/Fundraisings/avatar.png');

export const AddFundraisingForm = ({ jars, availableTags, onSubmit }: AddFundraisingFormProps) => {
    const theme = useTheme();
    const [imageUrl, setImageUrl] = useState<string>(defaultImage);
    const [openJarsMenu, setOpenJarsMenu] = useState(false);
    const [rulesAgreed, setRulesAgreed] = useState(false);
    const inputFile = useRef<HTMLInputElement | null>(null);

    const { handleSubmit, setValue, formState: { errors }, watch } = useZodForm(createFundraisingSchema);
    const selectedTags = watch('tags') || [];

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
    };

    const handleDeleteFile = () => {
        setImageUrl(defaultImage);
        if (inputFile.current) {
            inputFile.current.value = '';
            inputFile.current.files = new DataTransfer().files;
        }
    };

    const handleFormSubmit = async (data: AddFundraisingFormData) => {
        const files = inputFile.current?.files;
        await onSubmit(data, files?.[0]);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            sx={styles.form}
        >
            <UploadImage
                inputFile={inputFile}
                handleFileUpload={handleFileUpload}
                handleDeleteFile={handleDeleteFile}
                url={imageUrl}
            />
            <Box sx={styles.formContent}>
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
                        open={openJarsMenu}
                        onClose={() => setOpenJarsMenu(false)}
                        onOpen={() => setOpenJarsMenu(true)}
                        sx={styles.select(theme)}
                        MenuProps={styles.menuProps(theme)}
                    >
                        {jars.map((jar) => (
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
                        values={availableTags}
                        freeSolo
                        limitTags={2}
                        value={selectedTags}
                        onChange={(newTags) => setValue('tags', newTags)}
                    />
                </Box>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rulesAgreed}
                            onChange={(e) => setRulesAgreed(e.target.checked)}
                            color="primary"
                        />
                    }
                    label={
                        <Box component="span" sx={{ color: theme.palette.text.secondary }}>
                            I agree to the{' '}
                            <Link
                                component={RouterLink}
                                to="/rules"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ fontWeight: 500 }}
                            >
                                platform rules and guidelines
                            </Link>
                        </Box>
                    }
                    sx={{ mt: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!rulesAgreed}
                    sx={styles.submitButton}
                >
                    Create Fundraising
                </Button>
            </Box>
        </Box>
    );
}; 