import { APIS, SupportedChainId } from '../../constants';

export const HealthcheckApi = (chainId: number | undefined) => {
  const config = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].Configuration({
    basePath: 'https://api.1inch.io',
  });
  const HealthcheckApi = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].HealthcheckApi(
    // @ts-ignore
    config
  );
  return HealthcheckApi;
};
