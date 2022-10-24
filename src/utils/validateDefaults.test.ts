import { parseUnits } from '@ethersproject/units';

import { DefaultTokenOptions, defaultTypedValueOptions, ReferrerOptions } from '../types';
import {
  validateDefaultTokensOptions,
  validateDefaultValue,
  validateReferrerOptions,
  validateSupportedChains,
} from './validateDefaults';

describe('validateSupportedChains', () => {
  it('should return result with supported chainId', () => {
    expect(validateSupportedChains(['1'])).toEqual({ hasNotSupported: false, notSupported: [] });
  });

  it('should return result with unsupported chainId', () => {
    expect(validateSupportedChains(['2'])).toEqual({ hasNotSupported: true, notSupported: ['2'] });
  });

  it('should return incorrectly calculated result', () => {
    expect(validateSupportedChains(['2'])).not.toEqual({ hasNotSupported: false, notSupported: [] });
  });
});

describe('validateReferrerOptions', () => {
  const referrerOptions: ReferrerOptions = {
    1: {
      referrerAddress: '0xaEA7F4FCbf447ECB296b5397020B48E82dcA430F',
      fee: '3',
    },
  };
  const referrerOptions2: ReferrerOptions = {
    1: {
      referrerAddress: '0xaEA7F4FCbf447ECB296b5397020B48E82dcA430F',
      // @ts-ignore
      fee: 2,
    },
  };

  it('should return empty string when referrer options is valid', () => {
    expect(validateReferrerOptions(referrerOptions)).toEqual('');
    expect(validateReferrerOptions(referrerOptions2)).toEqual('');
  });

  it('should return message with unsupported chainId', () => {
    const referrer: ReferrerOptions = {
      ...referrerOptions,
      // @ts-ignore
      2: {
        referrerAddress: '0xaEA7F4FCbf447ECB296b5397020B48E82dcA430F',
        fee: '3',
      },
    };
    expect(validateReferrerOptions(referrer)).toEqual('2 chains are not supported');
  });

  it('should return message for invalid fee', () => {
    const referrer: ReferrerOptions = {
      1: {
        referrerAddress: '0xaEA7F4FCbf447ECB296b5397020B48E82dcA430F',
        fee: '4',
      },
    };
    const referrer2: ReferrerOptions = {
      1: {
        referrerAddress: '0xaEA7F4FCbf447ECB296b5397020B48E82dcA430F',
        // @ts-ignore
        fee: 4,
      },
    };
    expect(validateReferrerOptions(referrer)).toEqual('fee should be a numeric string between 0 and 3');
    expect(validateReferrerOptions(referrer2)).toEqual('fee should be a numeric string between 0 and 3');
  });

  it('should return message for invalid referrer address', () => {
    const referrer: ReferrerOptions = {
      1: {
        referrerAddress: '0x0123',
        fee: '3',
      },
    };
    expect(validateReferrerOptions(referrer)).toEqual('referrerAddress should be a valid address');
  });
});

describe('validateDefaultTokensOptions', () => {
  it('should return empty string when default tokens options is valid', () => {
    const inputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual('');
  });

  it('should return result with unsupported chainId', () => {
    const inputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      // @ts-ignore
      25: '0xc21223249ca28397b4b6541dffaecc539bff0c59', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      // @ts-ignore
      25: '0xF2001B145b43032AAF5Ee2884e456CCd805F677D', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual(
      '25 chains are not supported. You should remove unsupported chains'
    );
  });

  it('should return message for missing input token', () => {
    const inputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      // 100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      // 100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual(
      'input token address for 100 should be a valid address'
    );
  });

  it('should return message for invalid input token', () => {
    const inputToken: DefaultTokenOptions = {
      1: '1234', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual(
      'input token address for 1 should be a valid address'
    );
  });

  it('should return message for missing output token', () => {
    const inputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      // 10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual(
      'output token address for 10 should be a valid address'
    );
  });

  it('should return message for invalid output token', () => {
    const inputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      // 100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual(
      'output token address for 100 should be a valid address'
    );
  });

  it('should return message for same addresses of input and output tokens', () => {
    const inputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607', // USDC
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USDC
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USD//C
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75', // USDC
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', // USDC
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // USDC
    };
    const outputToken: DefaultTokenOptions = {
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      10: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', // DAI
      100: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // WXDAI
      137: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', // DAI
      250: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e', // DAI
      42161: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', // DAI
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70', // DAI.e
    };
    expect(validateDefaultTokensOptions(inputToken, outputToken)).toEqual(
      'input token address should not be the same as the output token address for the same chainId (1)'
    );
  });
});

describe('validateDefaultValue', () => {
  it('should return empty string when default typed value options is valid', () => {
    const typedValue: defaultTypedValueOptions = {
      1: parseUnits('2', 6).toString(),
    };
    expect(validateDefaultValue(typedValue)).toEqual('');
  });

  it('should return message for default value is passed empty object', () => {
    expect(validateDefaultValue({})).toEqual('Empty object passed as defaultValue');
  });

  it('should return message for invalid chainId', () => {
    const typedValue: defaultTypedValueOptions = {
      // @ts-ignore
      25: '6000000',
    };
    expect(validateDefaultValue(typedValue)).toEqual('25 chains are not supported');
  });

  it('should return message for invalid default typed value', () => {
    const typedValue: defaultTypedValueOptions = {
      1: 'qwerty',
    };
    expect(validateDefaultValue(typedValue)).toEqual(
      'defaultValue keys must be chainIds and values must be BigNumberish (BigNumber | Bytes | bigint | string | number) with decimals that correspond to default input token'
    );
  });
});
