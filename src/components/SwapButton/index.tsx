import { TransactionRequest } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import React, { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSwap } from '../../store/state/swap/swapSlice';
import { useSwapCallback } from '../../store/state/swap/useSwapCallback';
import MainButton, { MainButtonType } from '../Buttons/MainButton';

const SwapButton = () => {
  const dispatch = useAppDispatch();
  const { INPUT, OUTPUT, typedValue, swapInfo } = useAppSelector((state) => state.swap);
  const { account } = useWeb3React();
  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const txData: TransactionRequest = {
    from: swapInfo?.tx?.from,
    to: swapInfo?.tx?.to,
    data: swapInfo?.tx?.data,
    value: swapInfo?.tx?.value,
    gasPrice: swapInfo?.tx?.gasPrice,
  };

  const swapCallback = useSwapCallback(txData);

  const handleClick = () => {
    dispatch(
      fetchSwap({
        fromTokenAddress: INPUT,
        toTokenAddress: OUTPUT,
        amount: typedValue,
        fromAddress: String(account),
        slippage: 1,
        disableEstimate: true,
      })
    );
    setIsWaiting(true);
  };

  const handleSendTx = useCallback(() => {
    try {
      swapCallback();
    } catch (error) {
      console.error(error);
    }
  }, [swapCallback]);

  return (
    <>
      <MainButton
        type={MainButtonType.Swap}
        onClick={handleClick}
        disabled={!(account && typedValue && !isWaiting)}
      />
      <MainButton
        type={MainButtonType.Confirm}
        onClick={handleSendTx}
        disabled={!(account && typedValue && swapInfo?.tx?.data)}
      />
    </>
  );
};

export default SwapButton;
