import React, {useState} from 'react';
import {Box} from "@mui/material";
import ReportTemplate from "../../templates/ReportTemplate/ReportTemplate";
import FundraisingsReports, {AddReportBody} from "../../services/api/FundraisingsReports/FundraisingsReports";
import {useLocation, useNavigate} from "react-router-dom";
import useInfo from "../../hooks/useInfo";

const AddReport = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState<Array<File>>([])
    const {addInfo} = useInfo()
    const {state} = useLocation()
    const navigate = useNavigate()
    const createFormData = () => {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append(`files`, file);
        });

        return formData;
    }
    const addReport = async () => {
       try {
           const body: AddReportBody = {
               title,
               description,
               fundraisingId: state.fundraisingId

           }
           const response: any = await FundraisingsReports.addReport(body)
           if (response) {
               if (response.error) {
                   addInfo('error', response.error.message)
               }
               else if (response.success) {
                   const formData = createFormData()
                   const attachaments = await FundraisingsReports.addAttachments(response.data.id, formData)
                   if (attachaments!.success) {
                       addInfo('success', 'Report has been added')
                       navigate('/my-fundraisings')
                   }
                   else if (attachaments!.error) {
                       addInfo('error', attachaments!.error.message)
                   }
               }
           }
       }
       catch (e: any) {
           addInfo('error', e.message)
       }
    }
    return (
        <Box>
            <ReportTemplate
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                files={files}
                setFiles={setFiles}
                buttonText={'Add'}
                onClickHandler={addReport}
                header={'Add report'}
            />
        </Box>
    );
};

export default AddReport;