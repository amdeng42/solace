import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MUISelect, { SelectChangeEvent } from "@mui/material/Select";


type SelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
};


const Select = ({ label, value, onChange, options }: SelectProps) => {

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 300 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="simple-select-label">{label}</InputLabel>
        <MUISelect
          labelId="simple-select-label"
          id="simple-select"
          variant="outlined"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </MUISelect>
      </FormControl>
    </Box>
  );
}

export default Select;