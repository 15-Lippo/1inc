import { t } from 'i18next';

export enum CustomGasPriceFieldId {
  maxFee = 'MAX_FEE',
  maxPriorityFee = 'MAX_PRIORITY_FEE',
}

export const GasPriceErrorTypes = {
  [CustomGasPriceFieldId.maxPriorityFee]: {
    invalidAverage: t('The average now is 1.00 Gwei'),
  },
  [CustomGasPriceFieldId.maxFee]: {
    lessPriorityFee: t(`Max fee can't be lower than Max priority fee`),
    greaterBaseFee: t(`Max price can't be lower than base fee`),
  },
};
