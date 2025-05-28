import React from "react";
import SignUpForm from "../components/auth/sign-up/SignUpForm";
import { Box, Paper, Step, StepLabel, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import EmailConfirmForm from "../components/auth/sign-up/EmailConfirmForm";
import useNotification from "../hooks/useNotification";
import '../styles/sign-up.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../store/auth.store";
import { SignUpFormData } from "../schemas/auth/signUpSchema";

const SignUpPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const adminToken = queryParams.get('adminToken') ?? undefined;

    const { refreshUser } = useUser();
    const { signUp, confirmEmail } = useAuth();
    const navigate = useNavigate();
    const { notifyError, Notification } = useNotification();

    const handleSignUp = async (data: SignUpFormData) => {
        const userId = await signUp({ ...data, adminToken });
        if (userId) {
            setUserId(userId);
        } else {
            notifyError("Error during signing up");
        }
    }

    const handleConfirmEmail = async (code: string) => {
        if (!userId) return;

        const success = await confirmEmail({ userId, code });
        if (success) {
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                notifyError('Error during signing in');
            }
        } else {
            notifyError("Error during confirming email");
        }
    }

    const [userId, setUserId] = React.useState<string | undefined>(undefined);
    const activeStep = userId ? 1 : 0;

    return (
        <Box className="sign-up-page">
            <Notification />
            <Box className="back-button" onClick={() => navigate('/')}>
                <ArrowBackIcon />
                <Typography>Back to home</Typography>
            </Box>
            <Paper elevation={3} className="sign-up-container">
                <Typography variant="h4" textAlign={'center'}>Sign Up</Typography>
                <Stepper activeStep={activeStep}>
                    <Step>
                        <StepLabel>Sign Up</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Confirm Email</StepLabel>
                    </Step>
                </Stepper>
                {!userId ? (
                    <SignUpForm onSubmit={handleSignUp} />
                ) : (
                    <EmailConfirmForm onSubmit={handleConfirmEmail} />
                )}
            </Paper>
        </Box>
    );
};

export default SignUpPage;