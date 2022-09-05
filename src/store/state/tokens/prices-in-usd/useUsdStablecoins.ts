import { useMemo } from 'react';

import { Tokens } from '../../../../constants';
import { useActiveWeb3React } from '../../../../packages';
import { SupportedChainId } from '../../../../types';
import { useAppSelector } from '../../../hooks';

export const useUsdStablecoins = () => {
  const tokens = useAppSelector((state) => state.tokens.tokens);

  const { chainId } = useActiveWeb3React();

  return useMemo(() => {
    const usdStablecoinAddresses = Tokens.DOLLAR_TIED_TOKENS[(chainId as SupportedChainId) || SupportedChainId.MAINNET];

    if (!usdStablecoinAddresses || !usdStablecoinAddresses.length) {
      console.error(`No stablecoins provided for chainId ${chainId}`);
      return { usdStablecoinAddresses: [], defaultStablecoin: undefined };
    }

    const defaultStablecoinAddress = usdStablecoinAddresses[0]; // will be used for usd prices
    const defaultStablecoin = tokens[defaultStablecoinAddress];

    return { usdStablecoinAddresses, defaultStablecoin };
  }, [chainId, tokens]);
};
