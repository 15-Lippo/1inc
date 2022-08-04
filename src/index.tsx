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
    // jsonRpcEndpoint={'https://cloudflare-eth.com'}
    referrerOptions={{
      [1337]: {
        referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
        fee: '3',
      },
    }}
    defaultTypedValue={{
      1: parseUnits('2', 6).toString(),
      137: parseUnits('2', 6).toString(),
      1337: parseUnits('2', 6).toString(),
    }}
    defaultInputTokenAddress={{
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      137: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      1337: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    }}
    defaultOutputTokenAddress={{
      1: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      137: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      1337: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    }}
  />
);
