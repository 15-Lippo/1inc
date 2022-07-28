import { Box, FormControlLabelProps, Stack, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { SupportedGasOptions } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCustomGasPrice, setGasPriceInfo } from '../../store/state/swap/swapSlice';
import { StarIcon } from '../icons';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 13,
  height: 13,
  border: `1px ${theme.palette.widget['checkbox-01']} solid`,
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  background: theme.palette.widget['checkbox-00'],
  border: `1px ${theme.palette.widget['checkbox-00']} solid`,
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
    backgroundColor: theme.palette.widget['input-bg'],
    marginBottom: '1px',
    color: theme.palette.widget['input-primary-text'],
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

  useEffect(() => {
    setValue(gasPriceInfo.label.toLowerCase());
  }, [gasPriceInfo.label]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    dispatch(setGasPriceInfo(gasOptions[value]));
    dispatch(
      setCustomGasPrice({
        label: '',
        maxPriorityFee: '0',
        maxFee: '0',
        range: '--/--',
        timeLabel: 'N/A',
      })
    );
    setValue(value);
  };

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
                {gasOptions[v].label.toLowerCase() === SupportedGasOptions.High && <StarIcon />}
                <Typography variant="rsm14" sx={{ m: '0 5px' }}>
                  {gasOptions[v].label}
                </Typography>
                <Typography color="widget.input-secondary-text" variant="rxs12">
                  {gasOptions[v].timeLabel}
                </Typography>
              </Box>
              <Typography color="widget.input-primary-text" variant="rsm14">
                {gasOptions[v].range}
              </Typography>
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
