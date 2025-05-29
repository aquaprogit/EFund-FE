import { Button } from "@mui/material"
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth.store";
import { useToast } from "../../contexts/ToastContext";

const AuthGoogleButton = (props: { label: string, type: 'sign-in' | 'sign-up' }) => {
    const { refreshUser } = useUser();
    const { googleSignIn } = useAuth();
    const { showError } = useToast();
    const navigate = useNavigate();

    const handleGoogleAuth = async (code: string) => {
        try {
            await googleSignIn(code);
            const user = await refreshUser();
            if (user) {
                navigate('/');
            } else {
                showError('Error during Google authentication');
            }
        } catch (error) {
            showError('Error during Google authentication');
        }
    };

    const login = useGoogleLogin({
        onSuccess: codeResp => handleGoogleAuth(codeResp.code),
        flow: 'auth-code'
    });

    return (
        <>
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