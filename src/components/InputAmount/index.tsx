import { parseUnits } from '@ethersproject/units';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Field, typeInput } from '../../store/state/swap/swapSlice';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    border: 'none',
    background: theme.palette.cool[100],
    '& fieldset': {
      border: 'none',
    },
    '& .MuiOutlinedInput-input': {
      paddingRight: '0',
      textAlign: 'right',
    },
  },
  '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
}));

export interface SendProps {
  inputId: Field;
}

const InputAmount = ({ inputId }: SendProps) => {
  const dispatch = useAppDispatch();
  const { INPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
  }));

  const setTypedValueSwap = (value: string, field: Field) => {
    const valueInWei = value ? parseUnits(value, INPUT.decimals).toString() : '';
    dispatch(typeInput({ field, typedValue: valueInWei }));
  };

  const debounceTypedValueSwap = _.debounce(setTypedValueSwap, 1000);

  const handleChange = ({ target }: any) => {
    if (INPUT?.address) debounceTypedValueSwap(target.value, target.id);
  };

  return (
    <StyledTextField
      inputProps={{
        min: 0,
      }}
      sx={{
        '& input': {
          typography: 'rxxlg24',
        },
      }}
      id={inputId}
      type="number"
      defaultValue={0}
      onChange={handleChange}
    />
  );
};

export default InputAmount;
