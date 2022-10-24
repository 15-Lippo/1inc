import { useCallback } from 'react';

import { ProtocolName } from '../../constants/protocolNames';
import { useAppDispatch } from '../../store';
import { updateQuote } from '../../store/state/swap/swapSlice';
import { useUpdateOneInchQuote } from './useUpdateOneInchQuote';
import { useUpdateParams } from './useUpdateParams';
import { useUpdateUniswapQuote } from './useUpdateUniswapQuote';

export const useUpdate = () => {
  const dispatch = useAppDispatch();

  const params = useUpdateParams();

  const oneInchUpdater = useUpdateOneInchQuote();
  const uniswapUpdater = useUpdateUniswapQuote();

  return useCallback(() => {
    if (!params) return;

    dispatch(
      updateQuote({
        updaters: [
          { name: ProtocolName.ONE_INCH, update: () => oneInchUpdater(params) },
          { name: ProtocolName.UNISWAP_V3, update: () => uniswapUpdater(params) },
        ],
        updateId: performance.now(),
      })
    );
  }, [params, oneInchUpdater, uniswapUpdater]);
};
