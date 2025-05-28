import { Box, TextField, Button } from "@mui/material";
import AuthGoogleButton from '../../google/SignInGoogle';
import { useZodForm } from "../../../hooks/useZodForm";
import { SignUpFormData, signUpSchema } from "../../../schemas/auth/signUpSchema";

interface SignUpFormProps {
    onSubmit: (data: SignUpFormData) => void;
}

const SignUpForm = (props: SignUpFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useZodForm(signUpSchema);

    return (
        <Box width='500px'>
            <Box
                display={'flex'}
                flexDirection={'column'}
                sx={{ gap: 3, margin: 5, mt: 10, mb: 10 }}
                component="form"
                onSubmit={handleSubmit(props.onSubmit)}>
                <TextField
                    id="name"
                    label="Name"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    variant="standard"
                    autoComplete='off'
                />
                <TextField
                    id="email"
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    variant="standard"
                    autoComplete='off'
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
                <TextField
                    id="passwordConfirm"
                    type="password"
                    label="Confirm Password"
                    {...register('confirmPassword')}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    variant="standard"
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ width: 'max-content', alignSelf: 'center' }}>
                        Sign Up
                    </Button>
                    <AuthGoogleButton type="sign-up" label="Sign up with Google" />
                </Box>
            </Box>
        </Box>
    );
};

export default SignUpForm;