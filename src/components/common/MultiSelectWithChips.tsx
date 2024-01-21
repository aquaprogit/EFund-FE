import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip, FilterOptionsState } from '@mui/material';
import useInfo from '../../hooks/useInfo';

const MultiSelectWithChip = (props: {
    label: string,
    values: string[],
    defaultValues?: string[],
    limitTags?: number,
    freeSolo?: boolean,
    width?: string,
    onChange: (selected: string[]) => void
}) => {
    const { sendNotification } = useInfo();
    const [selectedOptions, setSelectedOptions] = useState<string[]>(props.defaultValues || []);

    const handleChange = (event: React.SyntheticEvent, value: string[]) => {
        if (value.length > 5) {
            sendNotification('error', 'You can select up to 5 tags');
            return;
        }
        props.onChange(value);
        setSelectedOptions(value);
    };

    useEffect(() => {
        if (props.defaultValues)
            setSelectedOptions(props.defaultValues);
    }, [props.defaultValues]);

    return (
        <Autocomplete
            sx={{ ml: 0, width: props.width, maxWidth: '400px', minWidth: '100px' }}
            size='small'
            multiple
            limitTags={props.limitTags}
            freeSolo={props.freeSolo}
            defaultValue={props.defaultValues}
            options={props.values}
            value={selectedOptions}
            onChange={handleChange}
            renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                    <Chip color='primary' variant="filled" label={option.toLowerCase()} {...getTagProps({ index })} />
                ))
            }
            getOptionLabel={(option) => option.toLowerCase()}
            renderInput={(params) => (
                <TextField {...params} label={props.label} placeholder={props.label} />
            )}
        />
    );
};

export default MultiSelectWithChip;