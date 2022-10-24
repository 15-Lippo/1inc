import { useCallback } from 'react';

import { UpdateQuoteParams } from '../../services/types';
import { getOneInchQuote, QuoteInfo } from '../../services/update';

export const useUpdateOneInchQuote = (): ((params: UpdateQuoteParams) => Promise<QuoteInfo>) => {
  // is defined as hook to allow for protocol-dependent settings

  return useCallback(async (params: UpdateQuoteParams) => {
    try {
      return await getOneInchQuote(params);
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  }, []);
};
