import { useMemo } from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { useAppSelector } from '../../store';
import { useBuildOneInchTx } from './useBuildOneInchTx';
import { useBuildUniswapTx } from './useBuildUniswapTx';

export const useBuildSwapTx = () => {
  const selectedMethod = useAppSelector((state) => state.swap.selectedMethod);
  const buildOneInchTx = useBuildOneInchTx();
  const buildUniswapTx = useBuildUniswapTx();

  return useMemo(() => {
    const txBuilders = {
      [ProtocolName.ONE_INCH]: buildOneInchTx,
      [ProtocolName.UNISWAP_V3]: buildUniswapTx,
    };
    const txBuilder = txBuilders[selectedMethod];

    if (!txBuilder) {
      throw new Error(`No tx builder for swap method: ${selectedMethod}`);
    }

    return txBuilder;
  }, [selectedMethod, buildOneInchTx, buildUniswapTx]);
};
