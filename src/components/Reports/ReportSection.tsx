import React, {useEffect} from 'react';
import {Box, Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Reports from "./Reports";

type ReportSectionProps = {
    fundraisingId: string,
    reports: Array<any>,
    setReports: Function,
}

const ReportSection: React.FC<ReportSectionProps> = (
    {
        fundraisingId,
        reports,
        setReports
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

    useEffect(() => {

    }, []);
    return (
        <Box>
            <Button onClick={onClickHandler}>Add report</Button>
            <Reports setReports={setReports} reports={reports} />
        </Box>
    );
};

export default ReportSection;