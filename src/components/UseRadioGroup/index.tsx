import { Box, FormControlLabelProps, Stack, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Trans } from 'react-i18next';

import { GasOption } from '../../hooks';
import { setCustomGasPrice, setGasPriceInfo, useAppDispatch, useAppSelector } from '../../store';
import { SupportedGasOptions } from '../../types';
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

interface UseRadioGroupProps {
  gasOptions: { [option in SupportedGasOptions]?: GasOption };
}

export default function UseRadioGroup({ gasOptions }: UseRadioGroupProps) {
  const dispatch = useAppDispatch();

  // Set the calculated High option as a default value in radio group
  const gasPriceInfo = useAppSelector((state) => state.swap.txFeeCalculation?.gasPriceInfo);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = (event.target as HTMLInputElement).value;
    dispatch(setGasPriceInfo(gasOptions[v]));
    dispatch(
      setCustomGasPrice({
        label: '',
        maxPriorityFee: '0',
        maxFee: '0',
        range: '--/--',
        timeLabel: 'N/A',
      })
    );
  };

  return (
    <RadioGroup
      sx={{
        marginTop: '12px',
      }}
      name="use-radio-group"
      value={gasPriceInfo.id}
      onChange={handleChange}>
      {Object.keys(gasOptions).map((v) => (
        <StyledFormControlLabel
          key={gasOptions[v].id}
          value={gasOptions[v].id}
          label={
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {gasOptions[v].id === SupportedGasOptions.High && <StarIcon />}
                <Typography variant="rsm14" sx={{ m: '0 5px' }}>
                  <Trans>{gasOptions[v].label}</Trans>
                </Typography>
                <Typography color="widget.input-secondary-text" variant="rxs12">
                  <Trans>{gasOptions[v].timeLabel}</Trans>
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
