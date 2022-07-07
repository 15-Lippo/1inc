export enum CustomGasPriceFieldId {
  maxFee = 'MAX_FEE',
  maxPriorityFee = 'MAX_PRIORITY_FEE',
}

export const CustomGasPriceFieldErrorTypes = {
  [CustomGasPriceFieldId.maxPriorityFee]: {
    invalidAverage: 'The average now is 1.00 Gwei',
  },
  [CustomGasPriceFieldId.maxFee]: {
    lessPriorityFee: 'maxFee can not be lower than maxPriorityFee',
    greaterBaseFee: `Max price can't be lower than base fee`,
  },
};
