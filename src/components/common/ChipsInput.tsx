import { Box, Chip, TextField } from "@mui/material";
import { useState } from "react";
import '../../styles/components/chips-input.css';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

interface ChipsInputProps {
    placeholder?: string;
    existingValues: string[];
    selectedValues: string[];
    setSelectedValues: (chips: string[]) => void;
    limit?: number;
}

interface OptionType {
    inputValue?: string;
    title: string;
}

const filter = createFilterOptions<OptionType>();

const ChipsInput = (props: ChipsInputProps) => {
    const [value, setValue] = useState<OptionType | null>(null);

    const addValue = (value: any) => {
        if (props.limit && props.selectedValues.length >= props.limit) {
            return;
        }

        if (typeof value === "string") {
            props.setSelectedValues([...props.selectedValues, value]);
        } else {
            props.setSelectedValues([...props.selectedValues, value.title]);
        }
    };

    const handleDelete = (chipToDelete: string) => () => {
        props.setSelectedValues(props.selectedValues.filter((chip: string) => chip !== chipToDelete));
    };

    return (
        <div className="chips-input">
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        addValue({
                            title: newValue,
                        });
                    } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        addValue({
                            title: newValue.inputValue,
                        });
                    } else {
                        addValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.title);
                    if (inputValue !== '' && !isExisting) {
                        filtered.push({
                            inputValue,
                            title: `Add "${inputValue}"`,
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={props.existingValues}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.title;
                }}
                renderOption={(props, option) => <li {...props}>{option.title}</li>}
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Free solo with text demo" />
                )}
            />
            <Box className="chips-input__chips">
                {props.selectedValues.map((chip) => (
                    <Chip
                        key={chip}
                        label={chip}
                        onDelete={handleDelete(chip)}
                        className="chips-input__chip"
                    />
                ))}
            </Box>
        </div>
    );
}

export default ChipsInput;