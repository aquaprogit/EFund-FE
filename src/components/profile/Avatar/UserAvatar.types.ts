import React from "react";
import {RefreshUser} from "../../../contexts/UserContext";

export type UserAvatarProps = {
    inputFile: React.MutableRefObject<any> | null,
    refreshUser: RefreshUser
    url: string,
}