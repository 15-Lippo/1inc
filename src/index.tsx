import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n'; // import i18n (needs to be bundled ;))

import { parseEther } from '@ethersproject/units';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Widget from './components/Widget';

// FOR USING THE WIDGET AS A COMPONENT
export { Widget };

// UNCOMMENT FOR DEVELOPMENT:
export const root = createRoot(document.getElementById('root')!);
root.render(
  <Widget
    referrerOptions={{
      [1337]: {
        referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
        fee: '3',
      },
    }}
    jsonRpcEndpoint={'https://cloudflare-eth.com'}
    defaultTypedValue={parseEther('2')}
    defaultInputTokenAddress={{
      1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    }}
    defaultOutputTokenAddress={{
      1: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    }}
  />
);
