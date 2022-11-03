import { formatUnits, parseUnits } from '@ethersproject/units';
import { outlinedInputClasses, StandardTextFieldProps, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { Constants } from '../../../constants';
import { typeInput, useAppDispatch, useAppSelector } from '../../../store';
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
      }, 1200),
    [INPUT]
  );

  const handleChange = ({ target }: any) => {
    const { value, id } = target;

    // separator should be a dot and the string must not start with a separator
    let v = value.replaceAll(',', '.');
    if (v.match(/^\.[0-9]*/g)) v = '0' + v;

    const validated = v.match(Constants.INPUT_REGEX);
    if (validated) {
      setAmount(v);
      if (!Number(v)) return;
      if (INPUT.decimals) debouncedTypedValueSetter(v, id, INPUT.decimals);
    }
  };

  useEffect(() => {
    if (typedValue && INPUT && parseTypedAmount(amount, INPUT.decimals) !== typedValue) {
      const value = formatUnits(typedValue, INPUT.decimals);
      Constants.VALUE_LENGTH_REGEX.test(value) ? setAmount(Number(value).toFixed(6).toString()) : setAmount(value);
    }
  }, [typedValue, INPUT?.decimals]);

  return (
    <StyledTextField
      autoComplete="off"
      inputProps={{
        inputMode: 'numeric',
        type: 'text',
      }}
      sx={{
        '& input': {
          typography: 'mxlg20',
        },
      }}
      id={inputId}
      value={amount}
      onChange={handleChange}
    />
  );
};

export default InputAmount;
