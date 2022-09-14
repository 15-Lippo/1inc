import { parseUnits } from '@ethersproject/units';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { SwapWidget } from '../index.prod';

describe('Default values', () => {
  it('defaultInputTokenAddress set', async () => {
    act(() => {
      render(
        <SwapWidget
          defaultInputTokenAddress={{
            1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          }}
        />
      );
    });

    const input = await screen.findByTestId('input-token');

    await waitFor(() => expect(input).toHaveTextContent('USDC'));
  });

  it('defaultOutputTokenAddress set', async () => {
    act(() => {
      render(
        <SwapWidget
          defaultOutputTokenAddress={{
            1: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
          }}
        />
      );
    });

    const output = await screen.findByTestId('output-token');

    await waitFor(() => expect(output).toHaveTextContent('ETH'));
  });

  it('defaultTypedValue set', async () => {
    act(() => {
      render(
        <SwapWidget
          defaultTypedValue={{
            1: parseUnits('2', 6).toString(),
          }}
        />
      );
    });

    const value = await screen.findByDisplayValue('2.0');

    await waitFor(() => expect(value).toHaveDisplayValue('2.0'));
  });
});
