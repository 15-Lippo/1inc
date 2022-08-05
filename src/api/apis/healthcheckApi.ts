import { MainnetChainId, networkConfigs } from '../../constants';
import { SupportedChainId } from '../../types';

export const HealthcheckApi = (chainId: number | undefined) => {
  const config = new networkConfigs[chainId ? (chainId as SupportedChainId) : MainnetChainId].api.Configuration({
    basePath: 'https://api.1inch.io',
  });
  return new networkConfigs[chainId ? (chainId as SupportedChainId) : MainnetChainId].api.HealthcheckApi(config);
};
