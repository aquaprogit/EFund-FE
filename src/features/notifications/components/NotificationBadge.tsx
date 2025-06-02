import { Badge } from "@mui/material"
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from "@mui/material"
import { useEffect, useState } from "react";
import notificationsRepository from "../repository/notificationsRepository";

const NotificationBadge = () => {
    const [notificationsCount, setNotificationsCount] = useState(0);

    useEffect(() => {
        const fetchNotificationsCount = async () => {
            const result = await notificationsRepository.getNotifications(false);

            if (result.isSuccess) {
                setNotificationsCount(result.data?.length ?? 0);
            }
        }

        fetchNotificationsCount();
    }, []);

    return (
        <IconButton>
            <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon />
            </Badge>
        </IconButton>
    )
}

export default NotificationBadge;