import { parseUnits } from '@ethersproject/units';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Field, typeInput } from '../../store/state/swap/swapSlice';
import { Token } from '../../store/state/tokens/tokensSlice';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    border: 'none',
    background: theme.palette.cool[100],
    '& fieldset': {
      border: 'none',
    },
    '& .MuiOutlinedInput-input': {
      padding: '0',
      textAlign: 'right',
    },
  },
  '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
}));

export interface SendProps {
  inputId: Field;
}

const InputAmount = ({ inputId }: SendProps) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<string>('');
  const { INPUT } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    typedValue: state.swap.typedValue,
  }));
  const [input, setInput] = useState<Token>(INPUT);

  useEffect(() => {
    setInput(INPUT);
  }, [INPUT]);

  const setTypedValueSwap = (value: string, field: Field) => {
    setAmount(value);
    const valueInWei = value ? parseUnits(value, input?.decimals).toString() : '';
    dispatch(typeInput({ field, typedValue: valueInWei }));
  };

  useEffect(() => {
    setTypedValueSwap(amount, Field.INPUT);
  }, [input]);

  const debounceTypedValueSwap = _.debounce(setTypedValueSwap, 1000);

  const handleChange = ({ target }: any) => {
    if (input?.address) debounceTypedValueSwap(target.value, target.id);
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
