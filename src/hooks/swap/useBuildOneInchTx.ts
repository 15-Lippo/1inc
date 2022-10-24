import { useCallback } from 'react';

import { buildOneInchTx } from '../../services/swap/buildOneInchTx';
import { UpdateQuoteParams } from '../../services/types';
import { TxBuilder } from '../update/types';

export const useBuildOneInchTx = (): TxBuilder => {
  return useCallback(async (params: UpdateQuoteParams) => {
    try {
      return await buildOneInchTx(params);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }, []);
};
