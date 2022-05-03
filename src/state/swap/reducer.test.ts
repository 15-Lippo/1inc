import { Store } from 'redux';
import { legacy_createStore as createStore } from 'redux';

import { Field, selectCurrency, switchCurrencies, typeInput } from './actions';
import reducer, { SwapState } from './reducer';

describe('swap reducer', () => {
  let store: Store<SwapState>;

  beforeEach(() => {
    store = createStore(reducer, {
      [Field.OUTPUT]: { currencyId: '' },
      [Field.INPUT]: { currencyId: '' },
      typedValue: '',
      independentField: Field.INPUT,
      recipient: null,
    });
  });

  describe('typeInput', () => {
    it('typeInput 0.1 in OUTPUT field', () => {
      const typedValue = '0.1';
      store.dispatch(
        typeInput({
          field: Field.OUTPUT,
          typedValue,
        })
      );
      expect(store.getState()).toEqual({
        [Field.OUTPUT]: { currencyId: '' },
        [Field.INPUT]: { currencyId: '' },
        typedValue,
        independentField: Field.OUTPUT,
        recipient: null,
      });
    });

    it('typeInput 1000 in INPUT field', () => {
      const typedValue = '1000';
      store.dispatch(
        typeInput({
          field: Field.INPUT,
          typedValue,
        })
      );
      expect(store.getState()).toEqual({
        [Field.OUTPUT]: { currencyId: '' },
        [Field.INPUT]: { currencyId: '' },
        typedValue,
        independentField: Field.INPUT,
        recipient: null,
      });
    });
  });

  describe('selectCurrency', () => {
    it('selectCurrency OUTPUT', () => {
      store.dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: '0x0000',
        })
      );
      expect(store.getState()).toEqual({
        [Field.OUTPUT]: { currencyId: '0x0000' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null,
      });
    });

    it('switchCurrencies', () => {
      store.dispatch(switchCurrencies());
      expect(store.getState()).toEqual({
        [Field.OUTPUT]: { currencyId: '' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '',
        independentField: Field.OUTPUT,
        recipient: null,
      });
    });

    it('selectCurrency in both fields', () => {
      store.dispatch(
        selectCurrency({
          field: Field.INPUT,
          currencyId: '0x0000',
        })
      );
      store.dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: '0x1111',
        })
      );
      expect(store.getState()).toEqual({
        OUTPUT: { currencyId: '0x1111' },
        INPUT: { currencyId: '0x0000' },
        typedValue: '',
        independentField: 'INPUT',
        recipient: null,
      });
    });

    it('switchCurrencies', () => {
      store.dispatch(switchCurrencies());
      expect(store.getState()).toEqual({
        OUTPUT: { currencyId: '' },
        INPUT: { currencyId: '' },
        typedValue: '',
        independentField: 'OUTPUT',
        recipient: null,
      });
    });
  });
});
