import { Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSlippage } from '../../../store/state/swap/swapSlice';
import theme from '../../../theme/config';
import { StyledTextField } from '../../SelectTokenModal';
import SlippageWarningMsg from '../../SlippageWarningMsg';

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  display: 'flex',
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: '8px',
    },
    '&:first-of-type': {
      borderRadius: '8px',
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: theme.palette.cool[100],
    },
  },
}));

export const SlippageButtonsGroup = () => {
  const dispatch = useAppDispatch();
  const { slippage } = useAppSelector((state) => state.swap);
  const [customSlippage, setCustomSlippage] = useState<string>(
    slippage > 3 ? slippage.toString() : ''
  );

  const handleChange = (event: React.MouseEvent<HTMLElement>, newPercent: string) => {
    if (newPercent !== null) {
      setCustomSlippage('');
      dispatch(setSlippage({ percent: Number(newPercent) }));
    }
  };

  const onCustomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const checkedSlippage = value >= 50 ? 49 : value < 0 ? 0 : value;
    setCustomSlippage(checkedSlippage.toString());
    dispatch(setSlippage({ percent: checkedSlippage }));
  };
  return (
    <>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: 'cool.100',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '12px',
        }}>
        <StyledToggleButtonGroup
          value={slippage.toString()}
          exclusive
          onChange={handleChange}
          aria-label="slippage-percent">
          <ToggleButton
            sx={{
              color: 'dark.900',
              typography: 'rm16',
            }}
            value="0.1">
            0.1%
          </ToggleButton>
          <ToggleButton
            sx={{
              color: 'dark.900',
              typography: 'rm16',
            }}
            value="0.5">
            0.5%
          </ToggleButton>
          <ToggleButton
            sx={{
              width: '55px',
              color: 'dark.900',
              typography: 'rm16',
            }}
            value="1">
            1%
          </ToggleButton>
          <ToggleButton
            sx={{
              width: '55px',
              color: 'dark.900',
              typography: 'rm16',
            }}
            value="3">
            3%
          </ToggleButton>
        </StyledToggleButtonGroup>
        <StyledTextField
          InputProps={{ inputProps: { min: 0, max: 50 } }}
          value={customSlippage}
          sx={{
            padding: 0,
            margin: theme.spacing(0.5),
            width: '150px',
            '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& .MuiOutlinedInput-root': {
              '& .MuiOutlinedInput-input': {
                textAlign: 'center',
                padding: '11px',
              },
              '& fieldset': {
                borderColor: customSlippage ? theme.palette.blue[500] : '',
              },
            },
          }}
          id="custom-slippage"
          variant="outlined"
          type="number"
          placeholder="Custom"
          onChange={onCustomChange}
          margin="dense"
          fullWidth
        />
      </Paper>
      <SlippageWarningMsg slippagePercent={slippage} />
    </>
  );
};
