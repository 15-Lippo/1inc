import { Box, Divider, Stack, useTheme } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tokens } from '../../../constants';
import { useLocalStorage } from '../../../hooks';
import { selectCurrency, Token, useAppDispatch, useAppSelector, useUpdateUsdcPricesForBalances } from '../../../store';
import { Field } from '../../../types';
import { AddToken } from '../../buttons';
import { SearchTokenField } from '../../fields';
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
  const { account, chainId } = useWeb3React();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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

  // TODO: need to fix deps for timely updating of data in this hook. Added "tokens" as temporary solution.
  useEffect(() => {
    if (!tokensList.length) return;
    setData(tokensList);
  }, [tokensList.length, inputBalance, tokens]);

  useEffect(() => {
    if (!data.length || !chainId) return;
    updateUsdcPricesForBalances();
  }, [isOpen]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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
    setSearchValue(value);
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
  };

  const onUnpinToken = (address: string) => {
    chainId &&
      favoriteTokens[chainId].splice(
        favoriteTokens[chainId].findIndex((tokenAddress: string) => tokenAddress === address),
        1
      );
    setFavoriteTokens({ ...favoriteTokens });
  };

  return (
    <Modal headerType={ModalHeaderType.SelectToken} closeModal={closeModal} isOpen={isOpen}>
      <SearchTokenField
        inputProps={{ placeholder: t('Search by name or address') }}
        searchValue={searchValue}
        onChange={onSearch}
        onClear={() => setSearchValue('')}
      />
      {chainId && !_.isEmpty(tokens) && favoriteTokens[chainId] && (
        <React.Fragment>
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
          <Divider variant="middle" sx={{ borderColor: 'widget.border-01' }} />
          <VirtualizedTokenList
            tokensList={!searchValue ? data : filteredResults}
            onChoose={onChoose}
            onPinToken={onPinToken}
            onUnpinToken={onUnpinToken}
            selectedValue={tokenOnField}
            pinnedTokens={favoriteTokens[chainId]}
          />
        </React.Fragment>
      )}

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
