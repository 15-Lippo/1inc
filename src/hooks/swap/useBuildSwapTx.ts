import { useMemo } from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { useAppSelector } from '../../store';
import { useBuildOneInchTx } from './useBuildOneInchTx';

export const useBuildSwapTx = () => {
  const selectedMethod = useAppSelector((state) => state.swap.selectedMethod);
  const buildOneInchTx = useBuildOneInchTx();

  return useMemo(() => {
    const txBuilders = {
      [ProtocolName.ONE_INCH]: buildOneInchTx,
    };
    const txBuilder = txBuilders[selectedMethod];

    if (!txBuilder) {
      throw new Error(`No tx builder for swap method: ${selectedMethod}`);
    }

    return txBuilder;
  }, [selectedMethod, buildOneInchTx]);
};
