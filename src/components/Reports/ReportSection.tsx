import React, {useEffect} from 'react';
import {Box, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useInfo from "../../hooks/useInfo";

type ReportSectionProps = {
    fundraisingId: string,
    reports: Array<any>
}

const ReportSection: React.FC<ReportSectionProps> = (
    {
        fundraisingId,
        reports,
    }
) => {
    const navigate = useNavigate()
    const onClickHandler = () => {
        navigate('/add-report', {state: {fundraisingId}})
    }
    // const getReports = async () => {
    //     const response: any = await FundraisingsReports.getReport(fundraisingId)
    //     if (response){
    //         if (response.error) {
    //             addInfo("error", response.error.message)
    //         }
    //         else if (response.success) {
    //             setReports(response.data)
    //         }
    //
    //     }
    // }
    console.log(reports)

    useEffect(() => {

    }, []);
    return (
        <Box>
            <Button onClick={onClickHandler}>Add report</Button>
        </Box>
    );
};

export default ReportSection;