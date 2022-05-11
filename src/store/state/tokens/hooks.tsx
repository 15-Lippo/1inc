import { isAddress } from '@ethersproject/address';
import { Provider } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { AddressBalanceMap } from 'eth-balance-checker';
import { getAddressesBalances } from 'eth-balance-checker/lib/ethers';
import { useMemo } from 'react';

import { SupportedChainId } from '../../../constants/chains';
import { chunkArray } from '../../../utils/chunkArray';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Token, updateAllTokenBalances } from './tokensSlice';

export const MULTICALL_ADDRESS = {
  [SupportedChainId.MAINNET]: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39',
  [SupportedChainId.LOCALHOST]: '0xb1f8e55c7f64d203c1400b9d8555d050f94adf39',
  [SupportedChainId.ARBITRUM_ONE]: '0x151E24A486D7258dd7C33Fb67E4bB01919B7B32c',
  [SupportedChainId.OPTIMISM]: '0xB1c568e9C3E6bdaf755A60c7418C269eb11524FC',
  [SupportedChainId.POLYGON]: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
  [SupportedChainId.KOVAN]: '0x55ABBa8d669D60A10c104CC493ec5ef389EC92bb',
  [SupportedChainId.RINKEBY]: '0x3183B673f4816C94BeF53958BaF93C671B7F8Cf2',
  [SupportedChainId.ROPSTEN]: '0x8D9708f3F514206486D7E988533f770a16d074a7',
  [SupportedChainId.GOERLI]: '0x9788C4E93f9002a7ad8e72633b11E8d1ecd51f9b',
  [SupportedChainId.POLYGON_MUMBAI]: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
  [SupportedChainId.OPTIMISTIC_KOVAN]: '0xB1c568e9C3E6bdaf755A60c7418C269eb11524FC',
  [SupportedChainId.BINANCE]: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
  [SupportedChainId.BINANCE_TESTNET]: '0x2352c63A83f9Fd126af8676146721Fa00924d7e4',
  [SupportedChainId.AVALANCHE]: '0xD023D153a0DFa485130ECFdE2FAA7e612EF94818',
  [SupportedChainId.FANTOM]: '0x07f697424ABe762bB808c109860c04eA488ff92B',
};

async function getContractBalances(
  lib: Provider,
  addresses: string[],
  tokens: string[],
  chainId: number
): Promise<AddressBalanceMap> {
  return await getAddressesBalances(lib, addresses, tokens, {
    // @ts-ignore
    contractAddress: MULTICALL_ADDRESS[chainId],
  });
}

async function getTokenBalances(
  lib: Provider,
  account: string,
  chainId: number,
  allTokenObjects: Token[]
) {
  if (!account) return [];
  // Returns an array of validated addresses:
  const allAddresses = await allTokenObjects.map((vt) => vt.address);
  const nativeAddress = '0x0000000000000000000000000000000000000000';
  const validatedTokenAddresses = [...allAddresses, nativeAddress];
  try {
    const userAddresses = [account];
    const balances = await getContractBalances(
      lib,
      userAddresses,
      validatedTokenAddresses,
      chainId
    );

    return await Promise.all(
      allTokenObjects.map(async (token) => {
        const balance =
          token?.address.toLowerCase() ===
          ('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' || nativeAddress)
            ? balances[account][nativeAddress] || 0
            : balances[account][token?.address.toLowerCase()];

        // Convert balance:
        const balanceInEth = formatUnits(balance, token.decimals);
        const valueToReturn = Math.ceil(parseFloat(balanceInEth)) === 0 ? 0 : balanceInEth;
        return {
          ...token,
          tokenAmount: valueToReturn,
        };
      })
    );
  } catch ({ message }) {
    console.log('Error while executing get balances multicall: ', message);
    return allTokenObjects;
  }
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export async function tokenBalances(
  lib: Provider,
  account: string,
  chainId: number,
  validatedTokens: Token[]
) {
  if (!validatedTokens.length) return [];
  if (!account || !lib) return validatedTokens;
  const arrayLength = 200;

  // multicall is limited by block size. if the request contains more than 600 addresses for the Ether network, the transaction will fail
  // that's why a big array should be divided into smaller arrays

  const chunk = await chunkArray(validatedTokens, arrayLength);

  if (!chunk.length) return validatedTokens;
  // @ts-ignore
  const allBalances = await chunk.reduce(async (pV, cV) => {
    const previousValue = await pV;
    const res = await getTokenBalances(lib, account, chainId, cV);
    previousValue.push(res);
    return previousValue;
  }, []);

  if (allBalances.length > 0) {
    // Make one array of objects from [{...}, {...}, ]
    return allBalances.filter((v) => v !== undefined).reduce((pV, cV) => pV.concat(cV), []);
  } else {
    return validatedTokens;
  }
}

// Hook
export const useAllTokenBalances = () => {
  const dispatch = useAppDispatch();
  const tokensList = useAppSelector((state) => state.tokens.tokensList);
  const { library, account, chainId } = useWeb3React();

  const allTokensArray = useMemo(
    () => Object.values(tokensList ?? {}),
    // !DO NOT USE tokensList dependency here - it will call an endless look
    [account, library, chainId]
  );
  // Validation of all addresses:
  const validatedTokens = useMemo(
    // @ts-ignore
    () => allTokensArray?.filter((t?) => isAddress(t?.address)) ?? [],
    [allTokensArray]
  );

  return useMemo(async () => {
    if (!library || !account) return;

    if (validatedTokens.length) {
      // @ts-ignore
      const result = await tokenBalances(library, account, chainId, validatedTokens);
      dispatch(updateAllTokenBalances(result));
      return result;
    }
    return console.error('No validatedTokens array found', validatedTokens);
  }, [validatedTokens, allTokensArray, library, account, chainId, dispatch]);
};
