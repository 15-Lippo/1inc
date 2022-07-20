import { InputAdornment, TextField, TextFieldProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React, { useMemo } from 'react';

import { CustomGasPriceFieldId, GasPriceErrorTypes } from '../../../constants';

const StyledTextField: StyledComponent<any> = styled(TextField)<TextFieldProps>(({ theme, id, value, error }) => ({
  '& .MuiInputBase-formControl': {
    background: theme.palette.cool[100],
    borderRadius: '12px',
  },
  '& fieldset': {
    border: `1px solid ${
      error && value && id === CustomGasPriceFieldId.maxPriorityFee
        ? theme.palette.yellow[500]
        : error && value && id === CustomGasPriceFieldId.maxFee
        ? theme.palette.red[500]
        : !Number(value)
        ? theme.palette.red[500]
        : theme.palette.cool[100]
    }`,
  },
  '& .MuiInputBase-formControl.Mui-error fieldset': {
    borderColor:
      error && value && id === CustomGasPriceFieldId.maxPriorityFee
        ? theme.palette.yellow[500]
        : error && value && id === CustomGasPriceFieldId.maxFee
        ? theme.palette.red[500]
        : !Number(value)
        ? theme.palette.red[500]
        : theme.palette.cool[100],
  },
  '&:hover .MuiInputBase-formControl fieldset': {
    border: `1px solid ${
      error && value && id === CustomGasPriceFieldId.maxPriorityFee
        ? theme.palette.yellow[500]
        : error && value && id === CustomGasPriceFieldId.maxFee
        ? theme.palette.red[500]
        : !Number(value)
        ? theme.palette.red[500]
        : theme.palette.cool[100]
    }`,
  },
  '&:focus-within .MuiInputBase-formControl fieldset': {
    border: `1px solid ${
      error && value && id === CustomGasPriceFieldId.maxPriorityFee
        ? theme.palette.yellow[500]
        : error && value && id === CustomGasPriceFieldId.maxFee
        ? theme.palette.red[500]
        : !Number(value)
        ? theme.palette.red[500]
        : theme.palette.cool[100]
    }`,
  },
  '& .MuiOutlinedInput-input': {
    borderRadius: '12px',
    border: `1px solid ${theme.palette.cool[100]}`,
    padding: '15px',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: '0',
    '&.Mui-error': {
      color:
        error && value && id === CustomGasPriceFieldId.maxPriorityFee
          ? theme.palette.yellow[500]
          : error && value && id === CustomGasPriceFieldId.maxFee && theme.palette.red[500],
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
          color: 'dark.900',
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Typography variant="rm16" color="dark.700" lineHeight="19px">
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
