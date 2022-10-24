import { TransactionRequest } from '@ethersproject/providers';

import { UpdateQuoteParams } from '../../services/types';
import { QuoteInfo } from '../../services/update';

export interface QuoteUpdater {
  name: string;
  update(): Promise<QuoteInfo>;
}

export interface SwapInfo {
  tx: TransactionRequest;
  toTokenAmount: string;
}

export type TxBuilder = (params: UpdateQuoteParams) => Promise<SwapInfo>;
