import { BigNumber } from '@ethersproject/bignumber';
import { commify, formatUnits } from '@ethersproject/units';
import {
  Avatar,
  Box,
  Button,
  buttonClasses,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  listItemButtonClasses,
  ListItemText,
} from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { Tokens } from '../../constants';
import { Token, useAppSelector } from '../../store';
import { SupportedChainId } from '../../types';
import { bigFloatToFixed } from '../../utils';
import { CloseButton, LinkButton, PinButton } from '../buttons';
import { NoLogoURI, NoTokenFoundIcon } from '../icons';

interface VirtualizedTokenListProps {
  loading?: boolean;
  tokensList: Token[];
  selectedValue?: string;
  onChoose?: (val: string) => void;
  onPinToken?: (val: string) => void;
  onUnpinToken?: (val: string) => void;
  onRemoveCustomToken?: (val: string) => void;
  pinnedTokens: string[];
}

const VirtualizedTokenList = ({
  loading,
  tokensList,
  selectedValue,
  onChoose,
  onPinToken,
  onUnpinToken,
  onRemoveCustomToken,
  pinnedTokens,
}: VirtualizedTokenListProps) => {
  const { chainId } = useWeb3React();
  const { explorer } = useAppSelector((state) => state.user);
  const { usdToken } = useAppSelector((state) => ({
    usdToken: state.tokens.tokens[Tokens.DOLLAR_TIED_TOKENS[chainId as SupportedChainId][0]],
  }));

  const pinnedTokensSet = new Set<string>(pinnedTokens);

  function renderRow({ index, style }: ListChildComponentProps) {
    const { symbol, name, logoURI, userBalance, address, decimals, priceInUsd, button } = tokensList[index];

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
        ? formatUnits(BigNumber.from(userBalance).mul(BigNumber.from(priceInUsd)), decimals + usdToken.decimals)
        : '0';

    return (
      <ListItem
        sx={{
          [`& .${listItemButtonClasses.root}:hover`]: {
            bgcolor: 'widget.bg-01',
          },
        }}
        style={style}
        key={index}
        component="div"
        secondaryAction={
          onRemoveCustomToken ? (
            <React.Fragment>
              <CloseButton size="28" onClick={() => onRemoveCustomToken(address)} />
              <LinkButton onClick={openExplorer} />
            </React.Fragment>
          ) : (
            onPinToken &&
            onUnpinToken && (
              <PinButton id={address} onPin={onPinToken} onUnpin={onUnpinToken} pinned={pinnedTokensSet.has(address)} />
            )
          )
        }
        disablePadding>
        <ListItemButton onClick={handleClick} disabled={address === selectedValue}>
          {address && (
            <ListItemAvatar>
              <Avatar src={logoURI} alt={symbol} sx={{ backgroundColor: 'transparent' }}>
                <NoLogoURI />
              </Avatar>
            </ListItemAvatar>
          )}
          <ListItemText
            primaryTypographyProps={{
              typography: 'mm16',
              color: 'widget.text-primary',
            }}
            secondaryTypographyProps={{
              typography: 'rxs12',
              color: 'widget.text-secondary',
            }}
            primary={name}
            secondary={`${
              Number(userBalance) ? `${bigFloatToFixed(formatUnits(userBalance || '0x00', decimals), 4)}` : ''
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
              color: 'widget.text-primary',
              lineHeight: '19px',
            }}
            primary={
              button?.label || onRemoveCustomToken
                ? ''
                : Number(userBalance)
                ? `$${balanceInUsd && commify(bigFloatToFixed(balanceInUsd, 4))}`
                : '0'
            }
          />
          {button && (
            <Button
              variant="contained"
              sx={{
                color: 'widget.text-main-btn-01',
                [`& .${buttonClasses.root}`]: {
                  backgroundColor: 'widget.bg-04',
                },
                '&:hover': {
                  backgroundColor: 'widget.bg-04-hover',
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
        overflow: 'auto',
      }}>
      {loading ? (
        <Box
          sx={{
            height: '100%',
            alignItems: 'center',
            display: 'flex',
          }}>
          <CircularProgress sx={{ color: 'widget.icon-10' }} />
        </Box>
      ) : tokensList.length ? (
        <FixedSizeList height={500} width={'100%'} itemSize={72} itemCount={tokensList.length}>
          {renderRow}
        </FixedSizeList>
      ) : (
        <NoTokenFoundIcon />
      )}
    </Box>
  );
};

export default VirtualizedTokenList;
