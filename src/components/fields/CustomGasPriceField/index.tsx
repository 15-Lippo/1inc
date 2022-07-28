import { InputAdornment, TextField, TextFieldProps, Theme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React, { useMemo } from 'react';

import { CustomGasPriceFieldId, GasPriceErrorTypes } from '../../../constants';

const primaryBorderStyle = (error: any, value: any, id: any, theme: Theme) => {
  return `${
    error && value && id === CustomGasPriceFieldId.maxPriorityFee
      ? theme.palette.widget['input-border-warn']
      : error && value && id === CustomGasPriceFieldId.maxFee
      ? theme.palette.widget['input-border-error']
      : !Number(value)
      ? theme.palette.widget['input-border-error']
      : theme.palette.widget['input-border']
  }`;
};

const StyledTextField: StyledComponent<any> = styled(TextField)<TextFieldProps>(({ theme, id, value, error }) => ({
  '& .MuiInputBase-formControl': {
    color: theme.palette.widget['text-primary'],
    background: theme.palette.widget['input-bg'],
    borderRadius: '12px',
  },
  '& fieldset': {
    border: `1px solid ${primaryBorderStyle(error, value, id, theme)}`,
  },
  '& .MuiInputBase-formControl.Mui-error fieldset': {
    borderColor: primaryBorderStyle(error, value, id, theme),
  },
  '&:hover .MuiInputBase-formControl fieldset': {
    border: `1px solid ${primaryBorderStyle(error, value, id, theme)}`,
  },
  '&:focus-within .MuiInputBase-formControl fieldset': {
    border: `1px solid ${primaryBorderStyle(error, value, id, theme)}`,
  },
  '& .MuiOutlinedInput-input': {
    borderRadius: '12px',
    border: `1px solid ${theme.palette.widget['input-bg']}`,
    padding: '15px',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '0',
    '&.Mui-error': {
      color:
        error && value && id === CustomGasPriceFieldId.maxPriorityFee
          ? theme.palette.widget['input-border-warn']
          : error && value && id === CustomGasPriceFieldId.maxFee && theme.palette.widget['input-border-error'],
    },
  },
  '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
}));

interface Props {
  value: string;
  id: string;
  onChange: (e: any) => void;
  error?: boolean;
  typeError?: string;
}

const CustomGasPriceField = ({ value, id, onChange, error, typeError }: Props) => {
  const helperText = useMemo(() => {
    if (Number(value) && error) {
      if (id === CustomGasPriceFieldId.maxPriorityFee) return GasPriceErrorTypes[id].invalidAverage;
      if (id === CustomGasPriceFieldId.maxFee) return typeError;
    }
  }, [value, error]);

  return (
    <StyledTextField
      variant="outlined"
      type="number"
      id={id}
      sx={{
        '& input': {
          typography: 'rm16',
          lineHeight: '19px',
          color: 'widget.input-primary-text',
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography variant="rm16" color="widget.input-secondary-text" lineHeight="19px">
              Gwei
            </Typography>
          </InputAdornment>
        ),
      }}
      inputProps={{
        min: 0,
      }}
      error={!value || error}
      helperText={helperText}
      value={value}
      onChange={onChange}
      onWheel={(e: any) => e.target.blur()}
    />
  );
};

export default React.memo(CustomGasPriceField, (prevProps, nextProps) => _.isEqual(prevProps, nextProps));
