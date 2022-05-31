import { formatUnits } from '@ethersproject/units';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { Token } from '../../store/state/tokens/tokensSlice';

export interface VirtualizedTokenListProps {
  tokensList: Token[];
  selectedValue?: string;
  onChoose: (val: string) => void;
}

const VirtualizedTokenList = ({
  tokensList,
  selectedValue,
  onChoose,
}: VirtualizedTokenListProps) => {
  function renderRow({ index, style }: ListChildComponentProps) {
    const { symbol, name, logoURI, userBalance, address, decimals } = tokensList[index];

    const handleClick = () => {
      onChoose(tokensList[index].address);
    };

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
        disablePadding>
        <ListItemButton onClick={handleClick} disabled={address === selectedValue}>
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
            secondary={symbol}
          />
          <ListItemText
            sx={{
              flexDirection: 'row-reverse',
              display: 'flex',
            }}
            primaryTypographyProps={{
              typography: 'rm16',
              color: 'dark.900',
            }}
            primary={Number(userBalance) ? `${formatUnits(userBalance || '0x00', decimals)}` : ''}
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
