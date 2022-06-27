import { BigNumber } from '@ethersproject/bignumber';
import { commify, formatUnits } from '@ethersproject/units';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { useAppSelector } from '../../store/hooks';
import { Token } from '../../store/state/tokens/tokensSlice';
import CloseButton from '../Buttons/CloseButton';
import LinkButton from '../Buttons/LinkButton';
import PinButton from '../Buttons/PinButton';
import NoLogoURI from '../icons/NoLogoURI';
import NoTokenFoundIcon from '../icons/NoTokenFoundIcon';

export interface VirtualizedTokenListProps {
  loading?: boolean;
  tokensList: Token[];
  selectedValue?: string;
  onChoose?: (val: string) => void;
  onPinToken?: (val: string) => void;
  onUnpinToken?: (val: string) => void;
  onRemoveCustomToken?: (val: string) => void;
}

const VirtualizedTokenList = ({
  loading,
  tokensList,
  selectedValue,
  onChoose,
  onPinToken,
  onUnpinToken,
  onRemoveCustomToken,
}: VirtualizedTokenListProps) => {
  const { explorer } = useAppSelector((state) => state.user);

  function renderRow({ index, style }: ListChildComponentProps) {
    const { symbol, name, logoURI, userBalance, address, decimals, priceInUsd, button } =
      tokensList[index];

    const openExplorer = () => {
      window.open(`${explorer.link}/token/${address}`, '_blank');
    };

    const handleClick = () => {
      // ListItemButton must be unavailable until the token object has an import button
      if (button?.label) return;
      if (onChoose) {
        onChoose(tokensList[index].address);
      }
    };
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
        secondaryAction={
          onRemoveCustomToken ? (
            <>
              <CloseButton size="28" onClick={() => onRemoveCustomToken(address)} />
              <LinkButton onClick={openExplorer} />
            </>
          ) : (
            onPinToken &&
            onUnpinToken && <PinButton id={address} onPin={onPinToken} onUnpin={onUnpinToken} />
          )
        }
        disablePadding>
        <ListItemButton onClick={handleClick} disabled={address === selectedValue}>
          {address && (
            <ListItemAvatar>
              {logoURI ? <Avatar src={logoURI} alt={symbol} /> : <NoLogoURI />}
            </ListItemAvatar>
          )}
          <ListItemText
            primaryTypographyProps={{
              typography: 'mm16',
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
              button?.label || onRemoveCustomToken
                ? ''
                : Number(userBalance)
                ? `$${balanceInUsd && commify(parseFloat(balanceInUsd).toFixed(2))}`
                : '0'
            }
          />
          {button && (
            <Button
              variant="contained"
              sx={{
                '&.MuiButton-root': {
                  backgroundColor: 'blue.500',
                },
                '&:hover': {
                  backgroundColor: 'blue.70',
                  boxShadow: 'none',
                },
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: 'none',
              }}
              onClick={() => button.handleClick(tokensList[index])}>
              {button.label}
            </Button>
          )}
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: 'scroll',
      }}>
      {loading ? (
        <Box
          sx={{
            height: '100%',
            alignItems: 'center',
            display: 'flex',
          }}>
          <CircularProgress sx={{ color: 'blue.500' }} />
        </Box>
      ) : tokensList.length ? (
        <FixedSizeList height={400} width={'100%'} itemSize={72} itemCount={tokensList.length}>
          {renderRow}
        </FixedSizeList>
      ) : (
        <NoTokenFoundIcon />
      )}
    </Box>
  );
};

export default VirtualizedTokenList;
