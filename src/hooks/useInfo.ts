import {useContext} from "react";
import {ToasterContext} from "../contexts/ToasterContext";


const useInfo = () => {
    const {info, addInfo, removeInfo} = useContext(ToasterContext)
    return {
        info, addInfo, removeInfo
    }
}

export default useInfo;