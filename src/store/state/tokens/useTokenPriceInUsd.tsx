import { parseUnits } from '@ethersproject/units';
import { useState } from 'react';

import { SwapApi } from '../../../api';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Field } from '../swap/swapSlice';
import { updatePriceTokenInUsd } from './tokensSlice';

interface Props {
  isBalanceInUsd?: boolean;
  isMainModalTokenPriceInUsd?: boolean;
}

export function useTokenPriceInUsd({ isBalanceInUsd, isMainModalTokenPriceInUsd }: Props) {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, tokens } = useAppSelector((state) => ({
    INPUT: state.tokens.tokens[state.swap[Field.INPUT]],
    OUTPUT: state.tokens.tokens[state.swap[Field.OUTPUT]],
    tokens: state.tokens.tokens,
  }));
  const [priceTokenInUsd, setPriceTokenInUsd] = useState<string>('');
  const [usdcTokenAddress, setUsdcTokenAddress] = useState<string>('');

  const balancesInUsd = () => {
    const fetchTokenUsdValue = async ({ fromAddress, decimals }: { fromAddress: string; decimals: number }) => {
      const usdcToken = Object.entries(tokens).find(([, token]) => token.name === 'USD Coin');

      if (!usdcToken) return;

      setUsdcTokenAddress(usdcToken[1].address);
      try {
        const JSONApiResponse = await SwapApi.swapFactoryCommonControllerGetQuoteRaw({
          fromTokenAddress: fromAddress,
          toTokenAddress: usdcToken[1].address,
          amount: parseUnits('1', decimals).toString(),
        });

        const responseInfo = await JSONApiResponse.raw.json();
        const result = await responseInfo.toTokenAmount;
        return result;
      } catch (error) {
        console.error(error);
      }
    };

    isBalanceInUsd &&
      Object.entries(tokens).filter(([, token]) => {
        const getTokenPriceInUsd = async () => {
          try {
            const tokenPriceInUsd = await fetchTokenUsdValue({
              fromAddress: token.address,
              decimals: token.decimals,
            });
            dispatch(
              updatePriceTokenInUsd({
                key: token.address,
                priceInUsd: tokenPriceInUsd,
              })
            );
            setPriceTokenInUsd(tokenPriceInUsd);
          } catch (error) {
            console.error(error);
          }
        };
        token.userBalance && token.userBalance !== '0' && getTokenPriceInUsd();
      });

    if (isMainModalTokenPriceInUsd && INPUT.address && OUTPUT.address) {
      [INPUT, OUTPUT].forEach((token) => {
        const getTokenPriceInUsd = async () => {
          try {
            const tokenPriceInUsd = await fetchTokenUsdValue({
              fromAddress: token.address,
              decimals: token.decimals,
            });
            dispatch(
              updatePriceTokenInUsd({
                key: token.address,
                priceInUsd: tokenPriceInUsd,
              })
            );
          } catch (error) {
            console.error(error);
          }
        };
        getTokenPriceInUsd();
      });

      if (INPUT.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        const getTokenPriceInUsd = async () => {
          try {
            const tokenPriceInUsd = await fetchTokenUsdValue({
              fromAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
              decimals: INPUT.decimals,
            });
            dispatch(
              updatePriceTokenInUsd({
                key: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                priceInUsd: tokenPriceInUsd,
              })
            );
          } catch (error) {
            console.error(error);
          }
        };
        getTokenPriceInUsd();
      }

      if (INPUT.address === usdcTokenAddress || OUTPUT.address === usdcTokenAddress)
        dispatch(
          updatePriceTokenInUsd({
            key: usdcTokenAddress,
            priceInUsd: '1000000', // amount "1000000" is "1 USD" for "USD Coin"
          })
        );
    }
  };

  return { balancesInUsd, priceTokenInUsd };
}
