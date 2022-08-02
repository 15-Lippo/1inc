import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { StandardTextFieldProps, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { typeInput } from '../../../store/state/swap/swapSlice';
import { Field } from '../../../types';

const StyledTextField: StyledComponent<StandardTextFieldProps> = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    color: theme.palette.widget['text-primary'],
    border: 'none',
    background: theme.palette.widget['input-bg'],
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
    typedValue: BigNumber.from(state.swap.typedValue),
  }));
  const debouncedTypedValueSetter = useRef(
    _.debounce((value: string, field: Field) => {
      const valueInWei = calcWeiAmount(value);
      dispatch(typeInput({ field, typedValue: valueInWei }));
    }, 1000)
  );

  const calcWeiAmount = (value: string) => (value ? parseUnits(value, INPUT.decimals) : BigNumber.from('0'));

  const handleChange = ({ target }: any) => {
    setAmount(target.value);
    if (INPUT.address) debouncedTypedValueSetter.current(target.value, target.id);
  };

  useEffect(() => {
    if (!typedValue.isZero() && !typedValue.eq(calcWeiAmount(amount))) {
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
