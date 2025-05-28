import { Button } from "@mui/material"
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import useNotification from "../../hooks/useNotification";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth.store";

const AuthGoogleButton = (props: { label: string, type: 'sign-in' | 'sign-up' }) => {
    const { refreshUser } = useUser();
    const { googleSignIn } = useAuth();
    const { notifyError, Notification } = useNotification();
    const navigate = useNavigate();

    const handleGoogleAuth = async (code: string) => {
        try {
            await googleSignIn(code);
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                notifyError('Error during Google authentication');
            }
        } catch (error) {
            notifyError('Error during Google authentication');
        }
    };

    const login = useGoogleLogin({
        onSuccess: codeResp => handleGoogleAuth(codeResp.code),
        flow: 'auth-code'
    });

    return (
        <>
            <Notification />
            <Button
                startIcon={<GoogleIcon />}
                variant="contained"
                onClick={() => login()}
            >
                {props.label}
            </Button>
        </>
    );
}

export default AuthGoogleButton;