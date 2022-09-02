import './index.css';
import './components/Swap.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Swap from './components/Swap';
import Widget from './components/Widget';
import { SwapWidgetProps } from './index.prod';

console.log('Started in dev mode!');

export function SwapWidget(props: SwapWidgetProps) {
  return (
    <Widget {...props}>
      <Swap {...props} />
    </Widget>
  );
}

createRoot(document.getElementById('root')!).render(<SwapWidget />);
