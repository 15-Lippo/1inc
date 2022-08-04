import { Box, Divider, Stack, useTheme } from '@mui/material';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { Tokens } from '../../../constants';
import { useLocalStorage } from '../../../hooks';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectCurrency } from '../../../store/state/swap/swapSlice';
import { useUpdateUsdcPricesForBalances } from '../../../store/state/tokens/prices-in-usd/useTokenPricesInUsd';
import { onPinnedToken, Token } from '../../../store/state/tokens/tokensSlice';
import { Field } from '../../../types';
import { AddToken } from '../../buttons';
import PinnedToken from '../../PinnedToken';
import VirtualizedTokenList from '../../VirtualizedTokenList';
import { Modal, ModalHeaderType } from '../Modal';

interface SelectTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  onOpenCustomToken: () => void;
}

const SelectTokenModal = ({ isOpen, onClose, field, onOpenCustomToken }: SelectTokenModalProps) => {
  const theme = useTheme();
  const { account, chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { tokensList, tokenOnField, inputBalance, tokens } = useAppSelector((state) => ({
    tokensList: Object.values(state.tokens.tokens),
    tokenOnField: state.swap[field],
    inputBalance: state.tokens.tokens[state.swap[field]]?.userBalance || '0',
    tokens: state.tokens.tokens,
  }));
  const [favoriteTokens, setFavoriteTokens] = useLocalStorage('favorite-tokens', Tokens.FAVORITE_TOKENS);
  const [data, setData] = useState<Token[]>([]);
  const [filteredResults, setFilteredResults] = useState<Token[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const updateUsdcPricesForBalances = useUpdateUsdcPricesForBalances();

  useEffect(() => {
    if (!tokensList.length) return;
    setData(tokensList);
  }, [tokensList.length, inputBalance]);

  useEffect(() => {
    if (!data.length || !chainId) return;
    updateUsdcPricesForBalances();
  }, [isOpen]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const filteredData = data.filter((item) => {
      if (value.startsWith('0x')) {
        return item.address.toLowerCase().includes(value.toLowerCase());
      } else {
        return (
          item.name.toLowerCase().startsWith(value.toLowerCase()) ||
          item.symbol.toLowerCase().startsWith(value.toLowerCase())
        );
      }
    });
    setFilteredResults(filteredData);
  };

  const closeModal = () => {
    onClose();
    setSearchValue('');
  };

  const onChoose = (address: string) => {
    dispatch(
      selectCurrency({
        currency: address,
        field,
      })
    );
    closeModal();
  };

  const onPinToken = (address: string) => {
    if (chainId && favoriteTokens[chainId].length === 8) return;
    chainId && favoriteTokens[chainId].push(address);
    setFavoriteTokens({ ...favoriteTokens });
    dispatch(onPinnedToken({ key: address, pinned: true }));
  };

  const onUnpinToken = (address: string) => {
    chainId &&
      favoriteTokens[chainId].splice(
        favoriteTokens[chainId].findIndex((tokenAddress: string) => tokenAddress === address),
        1
      );
    setFavoriteTokens({ ...favoriteTokens });
    dispatch(onPinnedToken({ key: address, pinned: false }));
  };

  return (
    <Modal
      onSearch={onSearch}
      searchValue={searchValue}
      headerType={ModalHeaderType.SelectToken}
      closeModal={closeModal}
      isOpen={isOpen}>
      {chainId && !_.isEmpty(tokens) && (
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ alignItems: 'flex-start', columnGap: '6px', rowGap: '8px', m: '20px 16px 12px' }}>
          {favoriteTokens[chainId].map(
            (key: string) =>
              tokens[key]?.address && (
                <PinnedToken
                  key={tokens[key].address}
                  id={tokens[key].address}
                  symbol={tokens[key].symbol}
                  logo={tokens[key].logoURI}
                  onChoose={onChoose}
                  onUnpin={onUnpinToken}
                />
              )
          )}
        </Stack>
      )}

      <Divider variant="middle" sx={{ borderColor: 'widget.border-01' }} />
      <VirtualizedTokenList
        tokensList={!searchValue ? data : filteredResults}
        onChoose={onChoose}
        onPinToken={onPinToken}
        onUnpinToken={onUnpinToken}
        selectedValue={tokenOnField}
      />
      {searchValue && !filteredResults.length && (
        <Box
          sx={{
            width: 'inherit',
            position: 'absolute',
            left: '50%',
            bottom: -5,
            transform: 'translate(-50%, -50%)',
          }}>
          <hr
            color={theme.palette.widget['border-01']}
            style={{
              margin: 0,
              height: '1px',
              borderWidth: 0,
            }}
          />
          <AddToken
            walletIsConnected={!!account}
            onClick={() => {
              setSearchValue('');
              onOpenCustomToken();
            }}
          />
        </Box>
      )}
    </Modal>
  );
};

export default SelectTokenModal;
