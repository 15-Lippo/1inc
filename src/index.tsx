import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

import { parseUnits } from '@ethersproject/units';
import React from 'react';
import { createRoot } from 'react-dom/client';

import Swap from './components/Swap';
import Widget from './components/Widget';
import { nereusTheme } from './mui/theme';

function SwapWidget() {
  return (
    <Widget
      theme={nereusTheme}
      defaultTypedValue={{
        1: parseUnits('1', 18).toString(),
        56: parseUnits('1', 18).toString(),
        137: parseUnits('1', 18).toString(),
        250: parseUnits('1', 18).toString(),
        42161: parseUnits('1', 18).toString(),
        43114: parseUnits('1', 18).toString(),
      }}
      defaultInputTokenAddress={{
        1: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        56: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        137: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        250: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        42161: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        43114: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      }}
      defaultOutputTokenAddress={{
        1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        250: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        42161: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        43114: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
      }}>
      <Swap width={400} />
    </Widget>
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(<SwapWidget />);
