import { Box, Divider, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { FAVORITE_TOKENS } from '../../constants';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrency } from '../../store/state/swap/swapSlice';
import { onPinnedToken, Token } from '../../store/state/tokens/tokensSlice';
import { useTokenPriceInUsd } from '../../store/state/tokens/useTokenPriceInUsd';
import { Field } from '../../types';
import AddToken from '../Buttons/AddToken';
import { Modal, ModalHeaderType } from '../Modal';
import PinnedToken from '../PinnedToken';
import VirtualizedTokenList from '../VirtualizedTokenList';

interface SelectTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
  onOpenCustomToken: () => void;
}

const SelectTokenModal = ({ isOpen, onClose, field, onOpenCustomToken }: SelectTokenModalProps) => {
  const { account, chainId } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { tokensList, tokenOnField, inputBalance, tokens } = useAppSelector((state) => ({
    tokensList: Object.values(state.tokens.tokens),
    tokenOnField: state.swap[field],
    inputBalance: state.tokens.tokens[state.swap[field]]?.userBalance || '0',
    tokens: state.tokens.tokens,
  }));
  const [favoriteTokens, setFavoriteTokens] = useLocalStorage('favorite-tokens', FAVORITE_TOKENS);
  const [data, setData] = useState<Token[]>([]);
  const [filteredResults, setFilteredResults] = useState<Token[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const { balancesInUsd, priceTokenInUsd } = useTokenPriceInUsd({ isBalanceInUsd: true });

  useEffect(() => {
    setData(tokensList);
  }, [tokensList.length, inputBalance, priceTokenInUsd]);

  useEffect(() => {
    if (!data.length || !chainId) return;
    balancesInUsd();
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
      <Stack
        direction="row"
        flexWrap="wrap"
        sx={{ alignItems: 'flex-start', columnGap: '6px', rowGap: '8px', m: '20px 16px 12px' }}>
        {chainId
          ? favoriteTokens[chainId].map((key: string) => (
              <PinnedToken
                key={tokens[key].address}
                id={tokens[key].address}
                symbol={tokens[key].symbol}
                logo={tokens[key].logoURI}
                onChoose={onChoose}
                onUnpin={onUnpinToken}
              />
            ))
          : null}
      </Stack>

      <Divider variant="middle" sx={{ borderColor: 'cool.300' }} />
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
            color="#E3E7EE"
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
