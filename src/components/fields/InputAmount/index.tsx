import { formatUnits, parseUnits } from '@ethersproject/units';
import { StandardTextFieldProps, TextField } from '@mui/material';
import { outlinedInputClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { typeInput } from '../../../store/state/swap/swapSlice';
import { Field } from '../../../types';

const StyledTextField: StyledComponent<StandardTextFieldProps> = styled(TextField)(({ theme }) => ({
  width: '100%',
  [`& .${outlinedInputClasses.root}`]: {
    color: theme.palette.widget['text-primary'],
    border: 'none',
    background: theme.palette.widget['input-bg'],
    '& fieldset': {
      border: 'none',
    },
    [`& .${outlinedInputClasses.input}`]: {
      padding: '0',
      textAlign: 'right',
    },
  },
  '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
}));

interface SendProps {
  inputId: Field;
}

// This value will respect the decimals of the INPUT
const parseTypedAmount = (value: string, decimals: number) => (value ? parseUnits(value, decimals).toString() : '0');

const InputAmount = ({ inputId }: SendProps) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<string>('0');
  const { INPUT, typedValue } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]],
    typedValue: state.swap.typedValue,
  }));

  const debouncedTypedValueSetter = useMemo(
    () =>
      _.debounce((value: string, field: Field, decimals: number) => {
        const valueInWei = parseTypedAmount(value, decimals);
        dispatch(typeInput({ field, typedValue: valueInWei }));
      }, 1000),
    [INPUT]
  );

  const handleChange = ({ target }: any) => {
    setAmount(target.value);
    if (INPUT) debouncedTypedValueSetter(target.value, target.id, INPUT.decimals);
  };

  useEffect(() => {
    if (typedValue && INPUT && parseTypedAmount(amount, INPUT.decimals) !== typedValue) {
      setAmount(formatUnits(typedValue, INPUT.decimals));
    }
  }, [typedValue]);

  return (
    <StyledTextField
      inputProps={{
        min: 0,
      }}
      sx={{
        '& input': {
          typography: 'mxlg20',
        },
      }}
      id={inputId}
      type="number"
      value={amount}
      onChange={handleChange}
    />
  );
};

export default InputAmount;
