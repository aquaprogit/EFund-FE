import React, {useMemo} from 'react';
import Snackbar from "@mui/material/Snackbar";
import Alert, {AlertColor} from "@mui/material/Alert";
import useInfo from "../../hooks/useInfo";


const Toaster: React.FC = () => {
    const {info, removeInfo} = useInfo();
    const isOpen = useMemo(() => !!Object.keys(info).length, [info] )
    const onCloseToaster = () => removeInfo();
    return (
        <Snackbar
            open={isOpen}
            onClose={onCloseToaster}
            autoHideDuration={3000}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert severity={'error' as AlertColor}>{info.message}</Alert>
        </Snackbar>
    );
};

export default Toaster;