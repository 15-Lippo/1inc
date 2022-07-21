import { APIS, SupportedChainId } from '../../constants';

export const InfoApi = (chainId: number | undefined) => {
  const config = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].Configuration({
    basePath: 'https://api.1inch.io',
  });
  // @ts-ignore
  const InfoApi = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].InfoApi(config);
  return InfoApi;
};
