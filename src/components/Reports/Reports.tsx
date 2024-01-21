import React from 'react';
import {Box} from "@mui/material";
import Report, {ReportProps} from "./Report";

type ReportsProps = {
    reports: Array<ReportProps>,
    setReports: Function,
}

const Reports: React.FC<ReportsProps> = ({reports, setReports}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: '15px',

        }}>
            {
                reports.map(({id, title, description, fundraisingId, attachments }) =>
                    <Report reports={reports}  setReports={setReports} id={id} title={title} description={description} fundraisingId={fundraisingId} attachments={attachments}  />)
            }
        </Box>
    );
};

export default Reports;