import { networkConfigs } from '../../constants';
import { SupportedChainId } from '../../types';

export const ApproveApi = (chainId: number | undefined) => {
  const chain = !chainId || chainId === SupportedChainId.LOCALHOST ? SupportedChainId.MAINNET : chainId;
  const config = new networkConfigs[chain as SupportedChainId].api.Configuration({
    basePath: 'https://api.1inch.io',
  });
  return new networkConfigs[chain as SupportedChainId].api.ApproveApi(config);
};
