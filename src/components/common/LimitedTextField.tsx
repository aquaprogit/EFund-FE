import { Box, TextField, Typography } from "@mui/material";

interface LimitedTextFieldProps {
    maxChar: number;
    maxRows?: number;
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
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            width: '100%',
        }}>
            <TextField
                maxRows={props.maxRows}
                label={props.label}
                placeholder={props.placeholder}
                fullWidth={props.fullWidth}
                multiline={props.multiline}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                variant="standard"
                size="small" />
            <Typography variant="caption" color={limitReached ? 'text.primary' : 'text.secondary'} align="right">
                {value.length}/{props.maxChar}
            </Typography>
        </Box>
    );
};

export default LimitedTextField;