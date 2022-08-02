import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

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
