import { formatEther, parseUnits } from '@ethersproject/units';
import { StandardTextFieldProps, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { typeInput } from '../../../store/state/swap/swapSlice';
import { Token } from '../../../store/state/tokens/tokensSlice';
import { Field } from '../../../types';

const StyledTextField: StyledComponent<StandardTextFieldProps> = styled(TextField)(({ theme }) => ({
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

interface SendProps {
  inputId: Field;
}

const InputAmount = ({ inputId }: SendProps) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<string>('0');
  const { INPUT, typedValue } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap.INPUT],
    typedValue: state.swap.typedValue,
  }));
  const [input, setInput] = useState<Token>(INPUT);
  const debouncedTypedValueSetter = useRef(
    _.debounce((value: string, field: Field) => {
      const valueInWei = calcWeiAmount(value);
      dispatch(typeInput({ field, typedValue: valueInWei }));
    }, 1000)
  );

  useEffect(() => {
    setInput(INPUT);
  }, [INPUT]);

  const calcWeiAmount = (value: string) => (value ? parseUnits(value, input?.decimals).toString() : '');

  const handleChange = ({ target }: any) => {
    setAmount(target.value);
    if (input?.address) debouncedTypedValueSetter.current(target.value, target.id);
  };

  useEffect(() => {
    if (typedValue && calcWeiAmount(amount) !== typedValue) {
      setAmount(formatEther(typedValue));
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
