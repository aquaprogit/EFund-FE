import * as yup from 'yup';

const ResetPasswordValidation = yup.object({
    password: yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&.,:;])[A-Za-z\d@$!%*#?&.,:;]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        ),
    confirmPassword: yup.string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password')], "Passwords must match"),
});

export default ResetPasswordValidation;
