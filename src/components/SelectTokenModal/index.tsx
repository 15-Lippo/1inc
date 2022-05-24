import { Box, InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Field, selectCurrency } from '../../store/state/swap/swapSlice';
import { Token } from '../../store/state/tokens/tokensSlice';
import Modal, { ModalHeaderType } from '../Modal';
import VirtualizedTokenList from '../VirtualizedTokenList';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.cool[100],
    '& ::placeholder': {
      opacity: 'none',
      color: '#3E4D63',
    },
    borderRadius: '12px',
    '& fieldset': {
      color: theme.palette.dark[900],
      borderRadius: '12px',
      borderColor: theme.palette.cool[100],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.blue[500],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.blue[500],
    },
  },
}));

export interface SelectTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: Field;
}

const SelectTokenModal = ({ isOpen, onClose, field }: SelectTokenModalProps) => {
  const dispatch = useAppDispatch();
  const { tokensList, tokenOnField } = useAppSelector((state) => ({
    tokensList: Object.values(state.tokens.tokens),
    tokenOnField: state.swap[field],
  }));
  const [data, setData] = useState<Token[]>([]);
  const [filteredResults, setFilteredResults] = useState<Token[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setData(tokensList);
  }, [tokensList.length]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    const filteredData = data.filter((item) => {
      if (value.startsWith('0x0')) {
        return item.address.toLowerCase().startsWith(value.toLowerCase());
      }

      return (
        item.name.toLowerCase().startsWith(value.toLowerCase()) ||
        item.symbol.toLowerCase().startsWith(value.toLowerCase())
      );
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

  return (
    <Modal headerType={ModalHeaderType.SelectToken} closeModal={closeModal} isOpen={isOpen}>
      <Box
        sx={{
          m: '0 16px',
        }}>
        <StyledTextField
          id="search-token"
          variant="outlined"
          aria-label="search-token"
          type="search"
          value={searchValue}
          placeholder={'Search by name or paste address'}
          onChange={onSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img
                  alt="svgImg"
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iIzliYWZjZCI+PHBhdGggZD0iTTc0LjUzMzMzLDE3LjJjLTMxLjU5NjQyLDAgLTU3LjMzMzMzLDI1LjczNjkyIC01Ny4zMzMzMyw1Ny4zMzMzM2MwLDMxLjU5NjQyIDI1LjczNjkyLDU3LjMzMzMzIDU3LjMzMzMzLDU3LjMzMzMzYzEzLjczOTk4LDAgMjYuMzU4MzQsLTQuODc5MTUgMzYuMjQ3NjYsLTEyLjk3ODM5bDM0LjIzMjAzLDM0LjIzMjAzYzEuNDM4MDIsMS40OTc3OCAzLjU3MzQsMi4xMDExMyA1LjU4MjYsMS41NzczNWMyLjAwOTIsLTAuNTIzNzggMy41NzgyNiwtMi4wOTI4NCA0LjEwMjA0LC00LjEwMjA0YzAuNTIzNzgsLTIuMDA5MiAtMC4wNzk1NywtNC4xNDQ1OCAtMS41NzczNSwtNS41ODI2bC0zNC4yMzIwMywtMzQuMjMyMDNjOC4wOTkyNCwtOS44ODkzMiAxMi45NzgzOSwtMjIuNTA3NjggMTIuOTc4MzksLTM2LjI0NzY2YzAsLTMxLjU5NjQyIC0yNS43MzY5MiwtNTcuMzMzMzMgLTU3LjMzMzMzLC01Ny4zMzMzM3pNNzQuNTMzMzMsMjguNjY2NjdjMjUuMzk5MzcsMCA0NS44NjY2NywyMC40NjczIDQ1Ljg2NjY3LDQ1Ljg2NjY3YzAsMjUuMzk5MzcgLTIwLjQ2NzI5LDQ1Ljg2NjY3IC00NS44NjY2Nyw0NS44NjY2N2MtMjUuMzk5MzcsMCAtNDUuODY2NjcsLTIwLjQ2NzI5IC00NS44NjY2NywtNDUuODY2NjdjMCwtMjUuMzk5MzcgMjAuNDY3MywtNDUuODY2NjcgNDUuODY2NjcsLTQ1Ljg2NjY3eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
                />
              </InputAdornment>
            ),
          }}
          margin="dense"
          fullWidth
        />
      </Box>
      <VirtualizedTokenList
        tokensList={!searchValue ? data : filteredResults}
        onChoose={onChoose}
        selectedValue={tokenOnField}
      />
    </Modal>
  );
};

export default SelectTokenModal;
