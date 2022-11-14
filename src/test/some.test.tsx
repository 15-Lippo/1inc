import { render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { SwapWidget } from '../index';

it('should render', () => {
  act(() => {
    render(<SwapWidget />);
  });
  expect(screen.getByTestId('widget-root')).toBeInTheDocument();
});
