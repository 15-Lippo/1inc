import { calculateTxCost, calculateTxFee } from './calculateTxCost';

describe('calculateTxCost', () => {
  const txFee = '100';
  const typedValue = '1000000';

  it('should return sum of arguments in wei', () => {
    const result = '1000100';
    expect(calculateTxCost(txFee, typedValue)).toEqual(result);
  });

  it('should return incorrectly calculated result', () => {
    const result = '2000000';
    expect(calculateTxCost(txFee, typedValue)).not.toEqual(result);
  });
});

describe('calculateTxFee', () => {
  const gasLimit = '150000';
  const maxFeePerGas = '4192501680';

  it('should return result of multiplication of arguments in wei', () => {
    const result = '628875252000000';
    expect(calculateTxFee(gasLimit, maxFeePerGas)).toEqual(result);
  });

  it('should return incorrectly calculated result', () => {
    const result = '600000000000000';
    expect(calculateTxFee(gasLimit, maxFeePerGas)).not.toEqual(result);
  });
});
