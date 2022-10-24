import { networkConfigs } from '../../constants';
import { SupportedChainId } from '../../types';

export const SwapApi = (chainId: number | undefined) => {
  const chain = !chainId ? SupportedChainId.MAINNET : chainId;
  const config = new networkConfigs[chain as SupportedChainId].api.Configuration({
    basePath: 'https://api.1inch.io',
  });
  return new networkConfigs[chain as SupportedChainId].api.SwapApi(config);
};
