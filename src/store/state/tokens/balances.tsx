import { Web3Provider } from '@ethersproject/providers';

import TokenHelper from '../../../abi/TokenHelper.json';
import { TOKEN_HELPER_ADDRESS } from '../../../constants';
import { SupportedChainId } from '../../../constants/chains';
import { getContract } from '../../../utils/contract';

export interface IUserTokenInfo {
  [address: string]: {
    balance: string;
    allowance: string;
    pinned: boolean;
    priceInUsd?: string;
  };
}

export async function getTokenInfo(
  lib: Web3Provider,
  account: string,
  chainId: number,
  addresses: string[],
  spender: string
): Promise<Promise<IUserTokenInfo> | undefined> {
  //@ts-ignore
  const favoriteTokens = JSON.parse(localStorage.getItem('favorite-tokens'));
  const tokenHelper = getContract(
    TOKEN_HELPER_ADDRESS[chainId as SupportedChainId],
    TokenHelper.abi,
    lib
  );
  try {
    const tokenInfo = await tokenHelper.batchTokenInfo(account, addresses, spender);
    const result: IUserTokenInfo = {};
    for (let i = 0; i < addresses.length; i++) {
      result[addresses[i]] = {
        balance: tokenInfo[i].balance.toString(),
        allowance: tokenInfo[i].allowance.toString(),
        pinned: favoriteTokens[chainId].includes(addresses[i]),
        priceInUsd: '',
      };
    }
    return result;
  } catch (e) {
    console.error('Attempt to batchTokenInfo failed: ', e);
  }
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
    // After the first connect to ethereum mainnet fork all promises will return not right away. Please connect wallet an wait (5-10 min)
    promises.push(await getTokenInfo(lib, account, chainId, chunk, spender));
  }
  const result = await Promise.all(promises);
  return result.reduce((pV, cV) => {
    return {
      ...pV,
      ...cV,
    };
  }, {});
}
