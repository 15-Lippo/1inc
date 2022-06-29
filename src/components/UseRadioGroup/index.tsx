import { Box, FormControlLabelProps, Stack, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';

import { SupportedGasOptions } from '../../hooks/useGasPriceOptions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setGasPriceInfo } from '../../store/state/swap/swapSlice';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 13,
  height: 13,
  border: `1px ${theme.palette.dark[500]} solid`,
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  background: theme.palette.blue[500],
  border: `1px ${theme.palette.blue[500]} solid`,
  '&:before': {
    display: 'block',
    width: 13,
    height: 13,
    backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
    content: '""',
  },
}));

const StyledFormControlLabel = styled((props: FormControlLabelProps) => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    padding: '15px',
    backgroundColor: theme.palette.cool[100],
    marginBottom: '1px',
    '&:first-of-type': {
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
    },
    '&:last-of-type': {
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px',
    },
  })
);

export default function UseRadioGroup({ gasOptions }: any) {
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<string>(gasPriceInfo.label.toLowerCase());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    dispatch(setGasPriceInfo(gasOptions[value]));
    setValue(value);
  };

  const startIcon = (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 0L4.89806 2.76393H7.80423L5.45308 4.47214L6.35114 7.23607L4 5.52786L1.64886 7.23607L2.54692 4.47214L0.195774 2.76393H3.10194L4 0Z"
        fill="#2F8AF5"
      />
    </svg>
  );
  return (
    <RadioGroup
      sx={{
        marginTop: '12px',
      }}
      name="use-radio-group"
      value={value}
      onChange={handleChange}>
      {Object.keys(gasOptions).map((v) => (
        <StyledFormControlLabel
          key={gasOptions[v].label}
          value={gasOptions[v].label.toLowerCase()}
          label={
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {gasOptions[v].label.toLowerCase() === SupportedGasOptions.High && startIcon}
                <Typography variant="rsm14" sx={{ m: '0 5px' }}>
                  {gasOptions[v].label}
                </Typography>
                <Typography color="dark.700" variant="rxs12">
                  {gasOptions[v].timeLabel}
                </Typography>
              </Box>
              <Typography variant="rsm14">{gasOptions[v].range}</Typography>
            </Stack>
          }
          control={
            <Radio
              sx={{
                '&:hover': {
                  bgcolor: 'transparent',
                },
              }}
              disableRipple
              checkedIcon={<BpCheckedIcon />}
              icon={<BpIcon />}
            />
          }
        />
      ))}
    </RadioGroup>
  );
}
