import { Card, Container, Typography, useTheme } from "@mui/material";
import PageWrapper from "../../../shared/components/PageWrapper";
import { useEffect, useState } from "react";
import { monobankRepository } from "../../monobank/repository/monobankRepository";
import Jar from "../../monobank/models/Jar";
import { useToast } from "../../../contexts/ToastContext";
import { fundraisingsRepository } from "../repository/fundraisingsRepository";
import { useNavigate } from "react-router-dom";
import { tagsRepository } from "../../tags/repository/tagsRepository";
import { useUser } from "../../../contexts/UserContext";
import { Tag } from "../../tags/models/Tag";
import { AddFundraisingForm } from "../components/AddFundraisingForm";
import { styles } from "../components/AddFundraisingPage.styles";

const AddFundraisingPage = () => {
    const theme = useTheme();
    const [jars, setJars] = useState<Jar[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const { showError, showSuccess } = useToast();
    const navigate = useNavigate();
    const { user } = useUser();

    const getMonobankJars = async () => {
        try {
            const response = await monobankRepository.getJars();
            if (response?.data) {
                setJars(response.data as Jar[]);
            }
        } catch (e) {
            showError('Failed to fetch Monobank jars');
        }
    };

    const getTags = async () => {
        try {
            const response = await tagsRepository.getTags();
            if (response?.data) {
                setTags(response.data.map((tag: Tag) => tag.name));
            }
        } catch (e) {
            showError('Failed to fetch tags');
        }
    };

    const uploadImage = async (fundraisingId: string, file: File) => {
        try {
            const response = await fundraisingsRepository.uploadImage(fundraisingId, file);
            if (response.error) {
                throw new Error(response.error.message);
            }
        } catch (e) {
            throw new Error('Failed to upload image');
        }
    };

    const handleSubmit = async ({ title, description, monobankJarId, tags }: {
        title: string;
        description: string;
        monobankJarId: string;
        tags?: string[];
    }, imageFile?: File) => {
        try {
            const response = await fundraisingsRepository.createFundraising({
                title,
                description,
                monobankJarId,
                tags: tags || []
            });

            if (response.error) {
                throw new Error(response.error.message);
            }

            if (imageFile && response.data) {
                await uploadImage(response.data.id, imageFile);
            }

            showSuccess('Fundraising has been successfully created');
            navigate('/');
        } catch (e) {
            showError(e instanceof Error ? e.message : 'Failed to create fundraising');
        }
    };

    useEffect(() => {
        getMonobankJars();
        getTags();
    }, []);

    if (!user?.hasMonobankToken) {
        navigate('/');
        return null;
    }

    return (
        <PageWrapper>
            <Container maxWidth="md" sx={styles.container}>
                <Card
                    elevation={0}
                    sx={styles.card(theme)}
                >
                    <Typography
                        variant="h4"
                        textAlign="center"
                        sx={styles.title(theme)}
                    >
                        Create Fundraising
                    </Typography>
                    <AddFundraisingForm
                        jars={jars}
                        availableTags={tags}
                        onSubmit={handleSubmit}
                    />
                </Card>
            </Container>
        </PageWrapper>
    );
};

export default AddFundraisingPage;