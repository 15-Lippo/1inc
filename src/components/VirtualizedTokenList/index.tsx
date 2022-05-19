import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Field, selectCurrency, switchCurrencies } from '../../store/state/swap/swapSlice';

export interface VirtualizedTokenListProps {
  field: Field;
  closeModal: () => void;
}

const VirtualizedTokenList = ({ field, closeModal }: VirtualizedTokenListProps) => {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT } = useAppSelector((state) => state.swap);
  const tokensList = useAppSelector((state) => state.tokens.tokensList);
  const [selectedInputName, setSelectedInputName] = useState(INPUT.currency.name.toLowerCase());
  const [selectedOutputName, setSelectedOutputName] = useState(OUTPUT.currency.name.toLowerCase());

  useEffect(() => {
    setSelectedInputName(INPUT.currency.name.toLowerCase());
    setSelectedOutputName(OUTPUT.currency.name.toLowerCase());
  }, [INPUT, OUTPUT]);

  function renderRow({ index, style }: ListChildComponentProps) {
    const { symbol, name, logoURI, tokenAmount } = tokensList[index];

    const isSelectedInputName = selectedInputName === name.toLowerCase();
    const isSelectedOutputName = selectedOutputName === name.toLowerCase();

    const isDisabledInputName = field === Field.INPUT && isSelectedInputName;
    const isDisabledOutputName = field === Field.OUTPUT && isSelectedOutputName;

    const handleClick = () => {
      if (isSelectedInputName || isSelectedOutputName) {
        dispatch(switchCurrencies());
      }
      dispatch(
        selectCurrency({
          currency: tokensList[index],
          field,
        })
      );
      setSelectedInputName(name.toLowerCase());
      setSelectedOutputName(name.toLowerCase());
      closeModal();
    };

    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton
          onClick={handleClick}
          selected={isSelectedInputName || isSelectedOutputName}
          disabled={isDisabledInputName || isDisabledOutputName}>
          <ListItemAvatar>
            <Avatar src={logoURI} alt={symbol} />
          </ListItemAvatar>
          <ListItemText primary={name} secondary={symbol} />
          <ListItemText
            primary={`${tokenAmount || 0}`}
            style={{ display: 'flex', flexDirection: 'row-reverse' }}
          />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <FixedSizeList height={400} width={'100%'} itemSize={72} itemCount={tokensList.length}>
      {renderRow}
    </FixedSizeList>
  );
};

export default VirtualizedTokenList;
