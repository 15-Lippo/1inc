import { parseUnits } from '@ethersproject/units';
import { TextField } from '@mui/material';
import _ from 'lodash';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Field, typeInput } from '../../store/state/swap/swapSlice';

export interface SendProps {
  inputId: Field;
}

const InputAmount = ({ inputId }: SendProps) => {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT } = useAppSelector((state) => state.swap);

  const setTypedValueSwap = (value: string, field: Field) => {
    const decimals = field === Field.INPUT ? INPUT.currency.decimals : OUTPUT.currency.decimals;
    const valueInWei = parseUnits(value, decimals).toString();
    dispatch(typeInput({ field, typedValue: valueInWei }));
  };

  const debounceTypedValueSwap = _.debounce(setTypedValueSwap, 1000);

  const handleChange = ({ target }: any) => {
    if (INPUT.currency.address) debounceTypedValueSwap(target.value, target.id);
  };

  return (
    <TextField
      inputProps={{
        min: 0,
      }}
      id={inputId}
      type="number"
      defaultValue={0}
      onChange={handleChange}
    />
  );
};

export default InputAmount;
