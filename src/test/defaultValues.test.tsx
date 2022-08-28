import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { SwapWidget } from '../index';
import { renderWidget } from '.';

describe('Default values', () => {
  it('defaultInputTokenAddress set', async () => {
    act(() => {
      renderWidget(<SwapWidget />);
    });
    await waitFor(() => expect(screen.findByTestId('input-token')).toBeInTheDocument());
  });
});
