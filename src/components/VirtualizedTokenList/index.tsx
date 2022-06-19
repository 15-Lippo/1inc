import { BigNumber } from '@ethersproject/bignumber';
import { commify, formatUnits } from '@ethersproject/units';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { Token } from '../../store/state/tokens/tokensSlice';
import PinButton from '../Buttons/PinButton';

export interface VirtualizedTokenListProps {
  tokensList: Token[];
  selectedValue?: string;
  onChoose: (val: string) => void;
  onPinToken: (val: string) => void;
  onUnpinToken: (val: string) => void;
}

const VirtualizedTokenList = ({
  tokensList,
  selectedValue,
  onChoose,
  onPinToken,
  onUnpinToken,
}: VirtualizedTokenListProps) => {
  function renderRow({ index, style }: ListChildComponentProps) {
    const { symbol, name, logoURI, userBalance, address, decimals, priceInUsd } = tokensList[index];

    const balanceInUsd =
      Number(userBalance) && Number(priceInUsd)
        ? formatUnits(BigNumber.from(userBalance).mul(BigNumber.from(priceInUsd)), decimals + 6)
        : '0';

    return (
      <ListItem
        sx={{
          '& .MuiListItemButton-root:hover': {
            bgcolor: 'cool.300',
          },
        }}
        style={style}
        key={index}
        component="div"
        secondaryAction={<PinButton id={address} onPin={onPinToken} onUnpin={onUnpinToken} />}
        disablePadding>
        <ListItemButton onClick={() => onChoose(address)} disabled={address === selectedValue}>
          <ListItemAvatar>
            <Avatar src={logoURI} alt={symbol} />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              typography: 'rm16',
              color: 'dark.900',
            }}
            secondaryTypographyProps={{
              typography: 'rxs12',
              color: 'dark.700',
            }}
            primary={name}
            secondary={`${
              Number(userBalance)
                ? `${parseFloat(formatUnits(userBalance || '0x00', decimals)).toFixed(4)}`
                : ''
            } ${symbol}`}
          />
          <ListItemText
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              marginBottom: '21px',
            }}
            primaryTypographyProps={{
              typography: 'rm16',
              color: 'dark.900',
              lineHeight: '19px',
            }}
            primary={
              Number(userBalance)
                ? `$${balanceInUsd && commify(parseFloat(balanceInUsd).toFixed(2))}`
                : '0'
            }
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
