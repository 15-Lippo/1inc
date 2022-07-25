import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Widget from './components/Widget';

// FOR USING THE WIDGET AS A COMPONENT
export { Widget };

// UNCOMMENT FOR DEVELOPMENT:
export const root = createRoot(document.getElementById('root')!);
root.render(<Widget />);
