import { Button, TextField, Typography, Box } from "@mui/material";
import { useState } from "react";
import Users from "../../services/api/Users";

const EditName = ({ initialName, refreshUser }: { initialName: string, refreshUser: () => void }) => {
    const [name, setName] = useState<string>(initialName);
    const [edit, setEdit] = useState<boolean>(false);

    const handleSaveClick = async () => {
        await Users.updateInfo({ name });
        await refreshUser();
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '14px',
        }}>
            <Typography>Name:</Typography>
            {
                edit
                    ? <TextField
                        sx={{ width: '150px' }}
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    : <Typography>{initialName}</Typography>
            }
            {
                edit
                    ? (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 1,
                            alignItems: 'center',
                        }}>
                            <Button
                                size="small"
                                onClick={() => {
                                    setName(initialName);
                                    setEdit(false);
                                }}>Cancel</Button>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                    setEdit(false);
                                    handleSaveClick();
                                    refreshUser();
                                }}>Save</Button>
                        </Box>
                    )
                    : <Button onClick={() => setEdit(true)}>Edit</Button>
            }
        </Box>
    )
};

export default EditName;