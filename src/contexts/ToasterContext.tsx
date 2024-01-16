import React, {createContext, useCallback, useState} from "react";
import {AlertColor} from "@mui/material/Alert";

type ToasterSeverity = AlertColor | null
type ToasterMessage = string | null
type Info = {
    severity?: ToasterSeverity
    message?: ToasterMessage,
}
interface ToasterContext {
    info: Info,
    addInfo: (severity: ToasterSeverity, message: ToasterMessage) => void;
    removeInfo: () => void;
}

const defaultInfoValue = {}

export const ToasterContext = createContext<ToasterContext>({
    info: defaultInfoValue,
    addInfo: () => {},
    removeInfo: () => {},
})

const ToasterContextProvider: React.FC<any> = ({children}) => {
    const [info, setInfo] = useState<Info>(defaultInfoValue);

    const removeInfo = () => setInfo(defaultInfoValue);

    const addInfo = (severity: ToasterSeverity, message: ToasterMessage) => setInfo({message, severity });

    const contextValue = {
        info,
        addInfo: useCallback((severity: ToasterSeverity, message: ToasterMessage, ) => addInfo(severity, message), []),
        removeInfo: useCallback(() => removeInfo(), [])
    };

    return (
        <ToasterContext.Provider value={contextValue}>
            {children}
        </ToasterContext.Provider>
    );
}


export default ToasterContextProvider