import { Paper, Typography, Box } from "@mui/material";
import '../styles/sign-in.css'
import SignInForm from "../components/auth/SignInForm";
import { SignInFormFields } from "../models/form/auth/AuthFormFields";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../store/auth.store";
import { useToast } from "../contexts/ToastContext";
import BackButton from "../components/common/BackButton";

const SignInPage = () => {
    const { refreshUser } = useUser();
    const { signIn } = useAuth();
    const { showError } = useToast();
    const navigate = useNavigate();

    const onSubmit = async (fields: SignInFormFields) => {
        const error = await signIn(fields);
        if (error) {
            showError(error);
        } else {
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                showError('Error during signing in');
            }
        }
    };

    return (
        <Box className="sign-in-page">
            <Paper elevation={3} className="sign-in-container">
                <BackButton />
                <Typography variant="h4" textAlign={'center'}>Sign In</Typography>
                <SignInForm onSubmit={onSubmit} />
            </Paper>
        </Box>
    );
};

export default SignInPage;