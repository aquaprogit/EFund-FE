import User from "../models/user/User";
import { Card, Box, Avatar, Typography, Badge, Button, Dialog } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { useState } from "react";
import Users from "../services/api/Users";

const UserCard = ({ user, onAction }: { user: User, onAction: () => void }) => {
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);

    const [dialogPayload, setDialogPayload] = useState<{
        actionType: 'block' | 'unblock' | 'make admin';
        action: (user: User) => void;
    } | undefined>(undefined);

    const handleAction = (action: (user: User) => void) => {
        action(user);
        onAction();
    }

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                padding: '20px',
                gap: 3,
                width: '100%',
                minHeight: '150px',
                minWidth: '450px',
                height: '100%',
            }}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {

                    user.isAdmin ?
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <StarIcon sx={{
                                    width: '30px',
                                    height: '30px',
                                    color: 'gold'
                                }} />
                            }
                        >
                            <Avatar
                                sx={{
                                    width: '75px',
                                    height: '75px',
                                }}
                                alt={user.name}
                                src={user.avatarUrl} />
                        </Badge>
                        :
                        <Avatar
                            sx={{
                                width: '75px',
                                height: '75px',
                            }}
                            alt={user.name}
                            src={user.avatarUrl} />
                }
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'stretch',
                    gap: '1',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        alignItems: 'center',
                    }}>
                        <Typography variant="h6">{user.name}</Typography>
                        {
                            user.isBlocked
                                ? <Typography color={'error'} variant='h6'>Blocked</Typography>
                                : <></>
                        }
                    </Box>
                    <Typography variant='body2'>{user.email}</Typography>
                </Box>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    {
                        user.isAdmin ? <></>
                            : user.isBlocked
                                ? <Button
                                    variant='contained'
                                    color='success'
                                    onClick={() => {
                                        setDialogOpened(true);
                                        setDialogPayload({
                                            actionType: 'unblock',
                                            action: async (user) => {
                                                const result = await Users.action({ userId: user.id, action: 'unblock' });
                                                return result;
                                            }
                                        });
                                    }}
                                >
                                    Unblock
                                </Button>
                                : <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                        setDialogOpened(true);
                                        setDialogPayload({
                                            actionType: 'block',
                                            action: async (user) => {
                                                const result = await Users.action({ userId: user.id, action: 'block' });
                                                return result;
                                            }
                                        });
                                    }}
                                >
                                    Block
                                </Button>
                    }
                    {
                        user.isAdmin
                            ? <></>
                            : <Button
                                onClick={() => {
                                    setDialogOpened(true);
                                    setDialogPayload({
                                        actionType: 'make admin',
                                        action: async (user) => {
                                            const result = await Users.makeAdmin({ userId: user.id });
                                            if (result) {
                                                handleAction(() => { });
                                            }
                                        }
                                    });
                                }}
                            >Make admin</Button>}
                </Box>
            </Box>
            <Dialog
                open={!!dialogOpened}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 3,
                }}>
                    <Typography variant='h6'>Are you sure you want to {dialogPayload?.actionType} <br /> User <b>{user.name}</b> <br /> With email <b>{user.email}</b>?</Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        justifyContent: 'flex-end',
                    }}>
                        <Button
                            variant='outlined'
                            onClick={() => setDialogOpened(false)}
                        >Cancel</Button>
                        <Button
                            variant='contained'
                            color='error'
                            onClick={() => {
                                handleAction((user: User) => dialogPayload?.action(user));
                                setDialogOpened(false);
                            }}
                        >{dialogPayload?.actionType}</Button>
                    </Box>
                </Box>
            </Dialog>
        </Card>
    );
}

export default UserCard;