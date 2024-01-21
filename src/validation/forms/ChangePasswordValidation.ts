import * as yup from 'yup';

const ChangePasswordValidation = yup.object({
    password: yup.string()
        .required('Old password is required'),
    newPassword: yup.string()
        .required('New password is required')
        .notOneOf([yup.ref('password'), null], 'New password must be different from old password')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&.,:;])[A-Za-z\d@$!%*#?&.,:;]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character'
        )
});

export default ChangePasswordValidation;
