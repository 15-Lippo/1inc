import { Paper, ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setSlippage } from '../../../store/state/swap/swapSlice';
import { StyledSearchField } from '../../fields';
import { SlippageWarningMsg } from '../../messages';

export const StyledToggleButtonGroup: StyledComponent<ToggleButtonGroupProps> = styled(ToggleButtonGroup)(
  ({ theme }) => ({
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    display: 'flex',
    '& .MuiToggleButtonGroup-grouped': {
      color: theme.palette.widget['input-primary-text'],
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
        backgroundColor: theme.palette.widget['input-bg-01'],
        color: theme.palette.widget['input-primary-text'],
      },
      '&:hover': {
        backgroundColor: theme.palette.widget['input-bg'],
      },
    },
  })
);

export const SlippageButtonsGroup = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { slippage } = useAppSelector((state) => state.swap);
  const [customSlippage, setCustomSlippage] = useState<string>(slippage > 3 ? slippage.toString() : '');

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newPercent: string) => {
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
    <React.Fragment>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: theme.palette.widget['input-bg'],
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
              typography: 'rm16',
            }}
            value="0.1">
            0.1%
          </ToggleButton>
          <ToggleButton
            sx={{
              typography: 'rm16',
            }}
            value="0.5">
            0.5%
          </ToggleButton>
          <ToggleButton
            sx={{
              width: '55px',
              typography: 'rm16',
            }}
            value="1">
            1%
          </ToggleButton>
          <ToggleButton
            sx={{
              width: '55px',
              typography: 'rm16',
            }}
            value="3">
            3%
          </ToggleButton>
        </StyledToggleButtonGroup>
        <StyledSearchField
          InputProps={{ inputProps: { min: 0, max: 50 } }}
          value={customSlippage}
          sx={{
            padding: 0,
            gap: 0.5,
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
                borderColor: customSlippage ? theme.palette.widget['input-border'] : '',
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
    </React.Fragment>
  );
};
