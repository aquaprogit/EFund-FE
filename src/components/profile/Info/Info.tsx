import React, { useReducer } from 'react';
import { Box, Button, TextField, Typography, TypographyVariant } from "@mui/material";
import styles from './Info.module.css';
import { UpdateUserInfo } from "../../../services/api/Users";

type InfoItemProps = {
    id: string,
    placeholder: string,
    variant: TypographyVariant,
    edit: boolean,
    value: string,
    dispatch: React.Dispatch<Action>
}

type InfoProps = {
    info: Array<{
        initialValue: string,
        placeholder: string,
        variant: TypographyVariant
    }>,
    updateHandler: (data: UpdateUserInfo) => void,
}

type State = {
    isEditing: boolean,
    values: UpdateUserInfo
}

type Action =
    | { type: 'TOGGLE_EDIT' }
    | { type: 'UPDATE_VALUE', payload: { id: string, value: string } }
    | { type: 'SAVE' }
    | { type: 'CANCEL' }

const infoReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'TOGGLE_EDIT':
            return {
                ...state,
                isEditing: !state.isEditing,
            };
        case 'UPDATE_VALUE':
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.payload.id]: action.payload.value,
                },
            };
        case 'SAVE':
            return {
                ...state,
                isEditing: false,
            };
        default:
            return state;
    }
};

const InfoItem: React.FC<InfoItemProps> = ({ id, placeholder, variant, edit, value, dispatch }) => {
    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'UPDATE_VALUE', payload: { id, value: event.target.value } });
    };

    return (
        <Box className={styles.infoItem}>
            <Typography variant="h6">{placeholder}:</Typography>
            {edit ? (
                <TextField
                    placeholder={placeholder}
                    size="small"
                    value={value}
                    onChange={onChangeHandler}
                />
            ) : (
                <Typography
                    variant={variant}>{value}</Typography>
            )}
        </Box>
    );
};

const Info: React.FC<InfoProps> = ({ info, updateHandler }) => {
    const keys = ['name'];
    const initialState: State = {
        isEditing: false,
        values: info.reduce((acc, item) => ({ ...acc, [item.initialValue]: item.initialValue }), {}),
    };

    const [state, dispatch] = useReducer(infoReducer, initialState);
    const handleSave = () => {
        if (state.isEditing) {
            const values = Object.values(state.values);
            const dataToUpdate = keys.reduce((acc, key, currentIndex) => {
                // @ts-ignore
                acc[key] = values[currentIndex];
                return acc;
            }, {});

            updateHandler(dataToUpdate);
            dispatch({ type: 'SAVE' });
        } else {
            dispatch({ type: 'TOGGLE_EDIT' });
        }
    };

    return (
        <Box className={styles.info}>
            {info.map(({ initialValue, placeholder, variant }) => (
                <InfoItem
                    key={initialValue}
                    id={initialValue}
                    placeholder={placeholder}
                    variant={variant}
                    edit={state.isEditing}
                    value={state.values[initialValue]}
                    dispatch={dispatch}
                />
            ))}
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button onClick={handleSave}>
                    {state.isEditing ? 'Save' : 'Edit'}
                </Button>
                {state.isEditing && (<Button onClick={() => dispatch({ type: 'CANCEL' })}>Cancel</Button>)}
            </Box>
        </Box>
    );
};

export default Info;
