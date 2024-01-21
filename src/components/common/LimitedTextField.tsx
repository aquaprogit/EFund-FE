import { TextField, Typography } from "@mui/material";

interface LimitedTextFieldProps {
    maxChar: number;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    label?: string;
    fullWidth?: boolean;
}

const LimitedTextField = (props: LimitedTextFieldProps) => {
    const { value, onChange } = props;
    const limitReached = value.length === props.maxChar;

    const handleChange = (value: string) => {
        if (value.length <= props.maxChar) {
            onChange(value);
        }
    }

    return (
        <>
            <TextField
                label={props.label}
                placeholder={props.placeholder}
                fullWidth={props.fullWidth}
                multiline={props.multiline}
                value={value}
                maxRows={3}
                onChange={(e) => handleChange(e.target.value)}
                variant="standard"
                size="small" />
            <Typography variant="caption" color={limitReached ? 'text.primary' : 'text.secondary'} align="right">
                {value.length}/{props.maxChar}
            </Typography>
        </>
    );
};

export default LimitedTextField;