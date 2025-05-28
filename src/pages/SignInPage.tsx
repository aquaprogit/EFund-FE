import { Paper, Typography, Box } from "@mui/material";
import useNotification from "../hooks/useNotification";
import '../styles/sign-in.css';
import SignInForm from "../components/auth/sign-in/SignInForm";
import { SignInFormFields } from "../models/form/auth/AuthFormFields";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../store/auth.store";

const SignInPage = () => {
    const { updateUser, refreshUser } = useUser();
    const { signIn } = useAuth();
    const { notifyError, Notification } = useNotification();
    const navigate = useNavigate();

    const onSubmit = async (fields: SignInFormFields) => {
        const success = await signIn(fields);
        if (success) {
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                notifyError('Error during signing in');
            }
        } else {
            notifyError('Error during signing in');
        }
    };

    return (
        <Box className="sign-in-page">
            <Notification />
            <Box className="back-button" onClick={() => navigate('/')}>
                <ArrowBackIcon />
                <Typography>Back to home</Typography>
            </Box>
            <Paper elevation={3} className="sign-in-container">
                <Typography variant="h4" textAlign={'center'}>Sign In</Typography>
                <SignInForm onSubmit={onSubmit} />
            </Paper>
        </Box>
    );
}

export default SignInPage;