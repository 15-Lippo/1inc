import { Box, InputAdornment, InputProps } from '@mui/material';
import React from 'react';

import { CloseButton } from '../../buttons';
import { SearchIcon } from '../../icons';
import { StyledField } from '../../styled';

interface SearchProps {
  inputProps: InputProps;
  searchValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export default ({ searchValue, onChange, onClear, inputProps }: SearchProps) => {
  return (
    <Box
      sx={{
        m: '0 16px',
      }}>
      <StyledField
        id="search-token"
        variant="outlined"
        aria-label="search-token"
        type="search"
        autoComplete="off"
        value={searchValue}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: <CloseButton size="28" onClick={onClear} />,
          ...inputProps,
        }}
        margin="dense"
        fullWidth
      />
    </Box>
  );
};
