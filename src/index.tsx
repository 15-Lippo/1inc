import './mui/class-name-generator.config';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n'; // import i18n (needs to be bundled ;))

import { parseUnits } from '@ethersproject/units';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Widget from './components/Widget';

// FOR USING THE WIDGET AS A COMPONENT
export { Widget };

// UNCOMMENT FOR DEVELOPMENT:
export const root = createRoot(document.getElementById('root')!);
root.render(
  <Widget
    jsonRpcEndpoint={'https://eth-mainnet.alchemyapi.io/v2/GZsHH1TRhDm0UO_fv2QdczyFyw19eb-5'}
    referrerOptions={{
      [1337]: {
        referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
        fee: '3',
      },
    }}
    defaultTypedValue={{
      1: parseUnits('2', 6).toString(),
      10: parseUnits('2', 6).toString(),
      56: parseUnits('2', 18).toString(),
      100: parseUnits('2', 6).toString(),
      137: parseUnits('2', 6).toString(),
      250: parseUnits('2', 6).toString(),
      1337: parseUnits('2', 6).toString(),
      42161: parseUnits('2', 6).toString(),
      43114: parseUnits('2', 6).toString(),
    }}
    defaultInputTokenAddress={{
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      10: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      100: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
      1337: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    }}
    defaultOutputTokenAddress={{
      1: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      10: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      56: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      100: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      137: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      250: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      1337: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      42161: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      43114: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    }}
  />
);
