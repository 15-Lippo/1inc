import { BigNumber } from '@ethersproject/bignumber';
import { Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { CustomGasPriceFieldId, GasPriceErrorTypes } from '../../constants';
import { useAdvancedSettings, useFeeRange, useWaitTime } from '../../hooks';
import { useActiveWeb3React } from '../../packages/web3-provider';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCustomGasPrice } from '../../store/state/swap/swapSlice';
import { formatGweiFixed, parseGwei } from '../../utils';
import { MaxFeeButton } from '../buttons';
import { CustomGasPriceField } from '../fields';

type CustomSettingsState = {
  label: string;
  maxFee: string;
  maxPriorityFee: string;
  range: string;
  timeLabel: string;
};

type FieldErrorState = {
  isInvalidMaxFee: boolean;
  isInvalidMaxPriorityFee: boolean;
  typeError?: string;
};

const AdvancedGasPriceSettings = ({ gasOptions }: any) => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { gasPriceInfo, customGasPrice } = useAppSelector((state) => state.swap.txFeeCalculation);

  const { baseFee, baseFeeWei, maxFeeGwei, estPriorityFee, estMaxFee, maxPriorityFeeGwei } = useAdvancedSettings();

  const [customSettings, setCustomSettings] = useState<CustomSettingsState>({
    label: t(customGasPrice.label),
    maxFee: '0',
    maxPriorityFee: '0',
    timeLabel: '--/--',
    range: 'N/A',
  });
  const [fieldError, setFieldError] = useState<FieldErrorState>({
    isInvalidMaxFee: false,
    isInvalidMaxPriorityFee: false,
    typeError: '',
  });

  const updateState = (func: (state: any) => void, value: object) =>
    func((prevState: any) => ({ ...prevState, ...value }));

  // Data Initialization
  useLayoutEffect(() => {
    if (!customSettings.label) {
      setCustomSettings({
        label: t('Custom'),
        maxFee: maxFeeGwei,
        maxPriorityFee: maxPriorityFeeGwei,
        timeLabel: gasPriceInfo.timeLabel,
        range: gasPriceInfo.range,
      });
      return;
    }

    setCustomSettings({
      label: customGasPrice.label,
      maxFee: formatGweiFixed(customGasPrice.maxFee),
      maxPriorityFee: formatGweiFixed(customGasPrice.maxPriorityFee),
      range: customGasPrice.range,
      timeLabel: customGasPrice.timeLabel,
    });
  }, []);

  const feeRange = useFeeRange({
    maxFee: customSettings.maxFee,
    maxPriorityFee: customSettings.maxPriorityFee,
    baseFee: baseFeeWei,
  });
  const waitTime = useWaitTime({ maxFee: customSettings.maxFee, gasOptions, baseFee });

  useEffect(() => {
    if (!feeRange) return;
    updateState(setCustomSettings, { range: feeRange });
  }, [feeRange]);

  useEffect(() => {
    if (!waitTime) return;
    updateState(setCustomSettings, { timeLabel: waitTime });
  }, [waitTime]);

  // Validation maxPriorityFee
  useEffect(() => {
    if (!customSettings.maxPriorityFee) {
      // maxPriorityFee === '' | undefined
      updateState(setFieldError, { isInvalidMaxPriorityFee: true });
      updateState(setCustomSettings, { range: 'N/A' });
    } else if (
      parseGwei(customSettings.maxPriorityFee).gt(BigNumber.from('0')) &&
      parseGwei(customSettings.maxPriorityFee).lt(BigNumber.from(parseGwei('1')))
    ) {
      // maxPriorityFee > 0 && maxPriorityFee < 1
      updateState(setFieldError, { isInvalidMaxPriorityFee: true });
    } else {
      updateState(setFieldError, { isInvalidMaxPriorityFee: false });
    }
  }, [customSettings.maxPriorityFee]);

  // Validation maxFee
  useEffect(() => {
    if (!customSettings.maxPriorityFee) return;

    if (!customSettings.maxFee) {
      // maxFee === '' | undefined
      updateState(setFieldError, { isInvalidMaxFee: true });
      updateState(setCustomSettings, { range: 'N/A', timeLabel: '-- / --' });
      return;
    }

    if (parseGwei(customSettings.maxFee).gte(BigNumber.from('0')) && parseGwei(customSettings.maxFee).lt(baseFeeWei)) {
      // maxFee >= 0 && maxFee < baseFee
      updateState(setCustomSettings, { range: 'N/A', timeLabel: '-- / --' });
      updateState(setFieldError, {
        isInvalidMaxFee: true,
        typeError: GasPriceErrorTypes[CustomGasPriceFieldId.maxFee].greaterBaseFee,
      });
    } else if (parseGwei(customSettings.maxPriorityFee).gt(parseGwei(customSettings.maxFee))) {
      // maxPriorityFee > maxFee
      updateState(setFieldError, {
        isInvalidMaxFee: true,
        typeError: GasPriceErrorTypes[CustomGasPriceFieldId.maxFee].lessPriorityFee,
      });
    } else {
      updateState(setFieldError, { isInvalidMaxFee: false, typeError: '' });
    }
  }, [customSettings.maxFee, customSettings.maxPriorityFee]);

  // Dispatch Data To Store
  useEffect(() => {
    if (
      !account ||
      !customSettings.label ||
      fieldError.isInvalidMaxFee ||
      !customSettings.maxPriorityFee ||
      !Number(customSettings.maxFee)
    )
      return;

    dispatch(
      setCustomGasPrice({
        label: t('Custom'),
        maxPriorityFee: parseGwei(customSettings.maxPriorityFee).toString(),
        maxFee: parseGwei(customSettings.maxFee).toString(),
        range: customSettings.range,
        timeLabel: customSettings.timeLabel,
      })
    );
  }, [customSettings.maxPriorityFee, customSettings.range, fieldError.isInvalidMaxFee]);

  const feeValidationRegex = /^(?:\d{1,5}(?:\.\d{0,2})?)?$/;

  const onChangeMaxPriorityFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!feeValidationRegex.test(e.target.value)) return;
    updateState(setCustomSettings, { maxPriorityFee: e.target.value });
  };

  const onChangeMaxFee = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!feeValidationRegex.test(e.target.value)) return;
    updateState(setCustomSettings, { maxFee: e.target.value });
  };

  const onClickEstPriorityFee = () => {
    updateState(setCustomSettings, { maxPriorityFee: estPriorityFee });
  };

  const onClickEstMaxFee = () => {
    updateState(setCustomSettings, { maxFee: estMaxFee });
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          borderRadius: '12px',
          m: '16px 0',
          p: '19px 17px',
          bgcolor: 'widget.bg-alert',
          lineHeight: '19px',
          color: 'widget.text-alert',
        }}>
        {t('Current base fee is') + ` ${baseFee} Gwei`}
      </Box>
      <Stack sx={{ m: '16px 0' }}>
        <Stack sx={{ mb: '4px' }} direction="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
          <Typography variant="rm16" lineHeight="19px" color="widget.text-secondary">
            <Trans>Max priority fee</Trans>
          </Typography>
          <MaxFeeButton value={estPriorityFee} onClick={onClickEstPriorityFee} />
        </Stack>
        <CustomGasPriceField
          value={customSettings.maxPriorityFee}
          id={CustomGasPriceFieldId.maxPriorityFee}
          onChange={onChangeMaxPriorityFee}
          error={fieldError.isInvalidMaxPriorityFee}
        />
      </Stack>
      <Stack sx={{ m: '16px 0' }}>
        <Stack
          sx={{ color: 'widget.text-secondary', mb: '4px' }}
          direction="row"
          flexWrap="nowrap"
          justifyContent="space-between"
          alignItems="center">
          <Typography variant="rm16" lineHeight="19px">
            <Trans>Max fee</Trans>
          </Typography>
          <MaxFeeButton value={estMaxFee} onClick={onClickEstMaxFee} />
        </Stack>
        <CustomGasPriceField
          value={customSettings.maxFee}
          id={CustomGasPriceFieldId.maxFee}
          onChange={onChangeMaxFee}
          error={fieldError.isInvalidMaxFee}
          typeError={fieldError.typeError}
        />
      </Stack>
      <Stack
        sx={{
          border: '1px solid',
          borderColor: 'widget.border-01',
          borderRadius: '16px',
          m: '16px 0',
          p: '19px 17px',
          lineHeight: '19px',
          color: 'widget.text-primary',
        }}
        rowGap="10px">
        <Stack direction="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
          <Typography variant="rsm14" lineHeight="16px">
            <Trans>Wait time</Trans>
          </Typography>
          <Typography variant="rsm14" lineHeight="16px">
            <Trans>{customSettings.timeLabel}</Trans>
          </Typography>
        </Stack>
        <Stack direction="row" flexWrap="nowrap" justifyContent="space-between" alignItems="center">
          <Typography variant="rsm14" lineHeight="16px">
            <Trans>Fee range</Trans>
          </Typography>
          <Typography variant="rsm14" lineHeight="16px">
            {customSettings.range}
          </Typography>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};

export default AdvancedGasPriceSettings;
