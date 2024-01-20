import React from 'react';
import {Box, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

type ReportSectionProps = {
    fundraisingId: string,
}

const ReportSection: React.FC<ReportSectionProps> = (
    {
        fundraisingId
    }
) => {
    const navigate = useNavigate()
    const onClickHandler = () => {
        navigate('/add-report', {state: {fundraisingId}})
    }
    return (
        <Box>
            <Button onClick={onClickHandler}>Add report</Button>

        </Box>
    );
};

export default ReportSection;