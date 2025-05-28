import { Box, Button, TextField } from "@mui/material";
import { useZodForm } from "../../../hooks/useZodForm";
import { ConfirmEmailFormData, confirmEmailSchema } from "../../../schemas/auth/confirmEmailSchema";

interface EmailConfirmFormProps {
    onSubmit: (code: string) => void;
}

const EmailConfirmForm = (props: EmailConfirmFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useZodForm(confirmEmailSchema);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            sx={{ gap: 3, margin: 5, mt: 2, mb: 2 }}
            component="form"
            onSubmit={handleSubmit((data) => props.onSubmit(data.code))}>
            <TextField
                id="code"
                label="Confirmation Code"
                {...register('code')}
                error={!!errors.code}
                helperText={errors.code?.message}
                variant="standard"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                sx={{ width: 'max-content', alignSelf: 'center' }}>
                Confirm Email
            </Button>
        </Box>
    );
};

export default EmailConfirmForm;