import {UpdateUserInfo} from "../../../services/api/Users";

export type EditProps = {
    initialName: string,
    initialEmail: string,
    handleSaveClick: (data: UpdateUserInfo) => void,
}

export {}