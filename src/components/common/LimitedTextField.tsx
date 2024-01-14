import { TextField, Typography } from "@mui/material";

interface LimitedTextFieldProps {
    maxChar: number;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    label?: string;
    fullWidth?: boolean;
}

const LimitedTextField = (props: LimitedTextFieldProps) => {
    const limitReached = props.value.length === props.maxChar;

    const handleChange = (value: string) => {
        if (value.length <= props.maxChar) {
            props.onChange(value);
        }
    }

    return (
        <>
            <TextField
                {...props}
                onChange={(e) => handleChange(e.target.value)}
                variant="standard"
                size="small" />
            <Typography variant="caption" color={limitReached ? 'text.primary' : 'text.secondary'} align="right">
                {props.value.length}/{props.maxChar}
            </Typography>
        </>
    );
};

export default LimitedTextField;