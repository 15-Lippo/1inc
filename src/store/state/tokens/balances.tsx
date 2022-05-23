import { Web3Provider } from '@ethersproject/providers';

import TokenHelper from '../../../abi/TokenHelper.json';
import { TOKEN_HELPER_ADDRESS } from '../../../constants';
import { SupportedChainId } from '../../../constants/chains';
import { getContract } from '../../../utils/contract';

export interface IUserTokenInfo {
  [address: string]: {
    balance: string;
    allowance: string;
  };
}

export async function getTokenInfo(
  lib: Web3Provider,
  account: string,
  chainId: number,
  addresses: string[],
  spender: string
): Promise<IUserTokenInfo> {
  const tokenHelper = getContract(
    TOKEN_HELPER_ADDRESS[chainId as SupportedChainId],
    TokenHelper.abi,
    lib
  );
  const tokenInfo = await tokenHelper.batchTokenInfo(account, addresses, spender);
  const result: IUserTokenInfo = {};

  for (let i = 0; i < addresses.length; i++) {
    result[addresses[i]] = {
      balance: tokenInfo[i].balance.toString(),
      allowance: tokenInfo[i].allowance.toString(),
    };
  }
  return result;
}

const chunkArray = (list: any[], chunkSize: number) => {
  const results = [];
  for (let i = 0; i < list.length / chunkSize; i++) {
    const from = i * chunkSize;
    const to = from + Math.min(chunkSize, list.length);
    const chunk = list.slice(from, to);
    results.push(chunk);
  }
  return results;
};

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export async function getTokenBalances(
  lib: Web3Provider,
  account: string,
  chainId: number,
  addresses: string[],
  spender: string
) {
  if (!addresses.length || !account || !lib) return [];
  const arrayLength = 200;

  // Add native currency
  addresses.push('0x0000000000000000000000000000000000000000');

  // multicall is limited by block size. if the request contains more than 600 addresses for the Ether network, the transaction will fail
  // that's why a big array should be divided into smaller arrays
  const chunks = chunkArray(addresses, arrayLength);

  const promises = [];
  for (const chunk of chunks) {
    promises.push(getTokenInfo(lib, account, chainId, chunk, spender));
  }
  const result = await Promise.all(promises);
  return result.reduce((pV, cV) => {
    return {
      ...pV,
      ...cV,
    };
  }, {});
}