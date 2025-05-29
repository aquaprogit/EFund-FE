import React from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Box, Paper, Step, StepLabel, Typography } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import EmailConfirmForm from "../components/auth/EmailConfirmForm";
import '../styles/sign-up.css';
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../store/auth.store";
import { transformSignUpData } from "../schemas/auth/signUpSchema";
import { useToast } from "../contexts/ToastContext";
import BackButton from "../components/common/BackButton";

const SignUpPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const adminToken = queryParams.get('adminToken') ?? undefined;

    const { refreshUser } = useUser();
    const { signUp, confirmEmail } = useAuth();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    const handleSignUp = async (data: ReturnType<typeof transformSignUpData>) => {
        const { userId, error } = await signUp({ ...data, adminToken });
        if (userId) {
            setUserId(userId);
            showSuccess("Check your email for confirmation code");
        } else {
            showError(error ?? "Error during signing up");
        }
    }

    const handleConfirmEmail = async (code: string) => {
        if (!userId)
            return;

        const { success, error } = await confirmEmail({ userId, code });
        if (success) {
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                showError(error ?? "Error during signing in");
            }
        } else {
            showError(error ?? "Error during confirming email");
        }
    }

    const [userId, setUserId] = React.useState<string | undefined>(undefined);
    const activeStep = userId ? 1 : 0;

    return (
        <Box className="sign-up-page">
            <Paper
                elevation={3}
                className="sign-up-container"
            >
                <BackButton />
                <Typography variant="h4" textAlign={'center'}>Sign Up</Typography>
                {!userId ? (
                    <SignUpForm onSubmit={handleSignUp} />
                ) : (
                    <EmailConfirmForm onSubmit={handleConfirmEmail} />
                )}
                <Box sx={{
                    position: 'absolute',
                    bottom: '20px',
                    left: 0,
                    right: 0,
                    padding: '0 20px'
                }}>
                    <Stepper activeStep={activeStep}>
                        <Step>
                            <StepLabel>Sign Up</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Confirm Email</StepLabel>
                        </Step>
                    </Stepper>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignUpPage;