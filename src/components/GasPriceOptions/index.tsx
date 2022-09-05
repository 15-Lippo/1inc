import React from 'react';

import { setGasPriceSettingsMode, useAppDispatch, useAppSelector } from '../../store';
import AdvancedGasPriceSettings from '../AdvancedGasPriceSettings';
import SettingsMode from '../SettingsMode';
import UseRadioGroup from '../UseRadioGroup';

interface GasPriceOptionsProps {
  gasOptions: any;
}

const GasPriceOptions = ({ gasOptions }: GasPriceOptionsProps) => {
  const dispatch = useAppDispatch();
  const gasPriceSettingsMode = useAppSelector((state) => state.swap.txFeeCalculation.gasPriceSettingsMode);

  const handleChangeMode = (_event: React.MouseEvent<HTMLElement>, newMode: 'basic' | 'advanced') => {
    if (newMode !== null) {
      dispatch(setGasPriceSettingsMode(newMode));
    }
  };

  return (
    <React.Fragment>
      <SettingsMode mode={gasPriceSettingsMode} handleChangeMode={handleChangeMode} />
      {gasPriceSettingsMode === 'basic' ? (
        <UseRadioGroup gasOptions={gasOptions} />
      ) : (
        <AdvancedGasPriceSettings gasOptions={gasOptions} />
      )}
    </React.Fragment>
  );
};

export default GasPriceOptions;
