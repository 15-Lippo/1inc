import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers';

/**
 * Only transactions included in blocks post-Byzantium Hard Fork have this property status.
 * https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 * **/

export enum TxStatusType {
  'REVERTED',
  'SUCCESSFUL',
  'PENDING',
}

export enum FailedReasonType {
  OutOfGas = 'Out of gas',
}

const isTransactionMined = async (transactionHash: string, provider: Web3Provider | JsonRpcProvider) => {
  if (!provider || !transactionHash) return;
  const txReceipt = await provider.getTransactionReceipt(transactionHash);
  if (txReceipt && txReceipt.blockNumber) {
    return txReceipt;
  }
};

export interface ITxStatus {
  status: TxStatusType;
  error: FailedReasonType | null;
}

// Call isTransactionMined function and set TxStatus
export const getTxStatus = async (
  txHash: string,
  provider: Web3Provider | JsonRpcProvider,
  callback: ((arg0: ITxStatus) => void) | undefined
): Promise<ITxStatus | undefined> => {
  if (!txHash || !provider || !callback) return;

  const interval = setInterval(async () => {
    const txReceipt = await isTransactionMined(txHash, provider);

    if (txReceipt && txReceipt.status) {
      clearInterval(interval);

      callback({ status: TxStatusType.SUCCESSFUL, error: null });
    } else if (txReceipt && !txReceipt.status) {
      clearInterval(interval);

      // Returns the transaction with hash or null if the transaction is unknown.
      const txDetails = await provider.getTransaction(txHash);
      if (txDetails) {
        // Transaction Mined Successfully, But Contract Execution Failed
        const isAllGasUsed = txDetails.gasLimit.eq(txReceipt.gasUsed);
        // Dropped tx will be marked as "Out of gus"
        const failedReason = isAllGasUsed ? FailedReasonType.OutOfGas : null;

        callback({ status: TxStatusType.REVERTED, error: failedReason });
      }
    } else {
      callback({ status: TxStatusType.PENDING, error: null });
    }
  }, 1000);
};
