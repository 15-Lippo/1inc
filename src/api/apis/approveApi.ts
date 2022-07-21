import { APIS, SupportedChainId } from '../../constants';

export const ApproveApi = (chainId: number | undefined) => {
  const config = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].Configuration({
    basePath: 'https://api.1inch.io',
  });
  // @ts-ignore
  const ApproveApi = new APIS[chainId ? (chainId as SupportedChainId) : SupportedChainId.MAINNET].ApproveApi(config);
  return ApproveApi;
};
