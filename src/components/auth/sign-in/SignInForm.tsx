import { Box, Button, Divider, Link, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { SignInFormFields } from "../../../models/form/auth/AuthFormFields";
import AuthGoogleButton from "../../google/SignInGoogle";

interface SignInFormProps {
    onSubmit: (data: SignInFormFields) => void;
}

const SignInForm = (props: SignInFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormFields>();

    return (
        <Box width='400px'>
            <Box
                display={'flex'}
                flexDirection={'column'}
                sx={{ gap: 3, margin: 5, mt: 2, mb: 2 }}
                component="form"
                onSubmit={handleSubmit(props.onSubmit)}>
                <TextField
                    id="email"
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="standard"
                />
                <TextField
                    id="password"
                    type="password"
                    label="Password"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    variant="standard"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{ width: 'max-content', alignSelf: 'center' }}>
                    Sign In
                </Button>
            </Box>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                margin: 5,
                mt: 2,
                mb: 2
            }}>
                <Link href="/sign-up" underline="hover">
                    <Typography variant="caption" color={'text.primary'}>Don't have an account?</Typography>
                </Link>
                <Link href="/reset-password" underline="hover">
                    <Typography variant="caption" color={'text.primary'}>Forgot password?</Typography>
                </Link>
            </Box>
            <Divider />
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                margin: 5,
                mt: 2,
                mb: 2
            }}>
                <AuthGoogleButton type="sign-in" label="Sign in with Google" />
            </Box>
        </Box>
    );
};

export default SignInForm;