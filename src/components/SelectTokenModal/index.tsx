import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

import { Field } from '../../store/state/swap/swapSlice';
import { ITheme } from '../../theme';
import BackButton from '../Buttons/BackButton';
import VirtualizedTokenList from '../VirtualizedTokenList';

const useStyles = makeStyles((theme: ITheme) => ({
  selectTokenModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingBottom: '1em',
    backgroundColor: theme.palette.background.default,
  },
  selectTokenModalHeaderBox: {
    margin: '0.5em 1em 0',
  },
  selectTokenModalTitleBox: {
    display: 'flex',
    alignItems: 'center',
    height: '2.5em',
  },
  selectTokenModalTitle: {
    width: '100%',
    fontSize: '20px',
    fontWeight: '500',
    lineHeight: '23px',
    textAlign: 'center',
    color: theme.palette.dark[900],
  },
  line: {
    width: '100%',
    height: '1px',
    backgroundColor: theme.palette.cool[300],
  },
}));

export interface SelectTokenModalProps {
  isOpen: boolean;
  closeModal: () => void;
  field: Field;
}

const SelectTokenModal = ({ isOpen, closeModal, field }: SelectTokenModalProps) => {
  const classes = useStyles();
  const [isSearchValue, setIsSearchValue] = useState<string>('');

  return isOpen ? (
    <Box className={classes.selectTokenModal}>
      <Box className={classes.selectTokenModalHeaderBox}>
        <Box className={classes.selectTokenModalTitleBox}>
          <Box sx={{ position: 'absolute', ml: '-8px' }}>
            <BackButton onClick={closeModal} />
          </Box>
          <Typography className={classes.selectTokenModalTitle}>Select a token</Typography>
        </Box>
        <TextField
          id="search-token"
          variant="outlined"
          aria-label="search-token"
          type="search"
          value={isSearchValue}
          placeholder={'Search by name or paste address'}
          onChange={(e) => setIsSearchValue(e.target.value)}
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
        <Box>Pined Tokens</Box>
        <Box className={classes.line} />
      </Box>
      <VirtualizedTokenList field={field} closeModal={closeModal} />
    </Box>
  ) : null;
};

export default SelectTokenModal;
