import { parseUnits } from '@ethersproject/units';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';
import React from 'react';

import Widget, { WidgetProps } from '../components/Widget';
import { DEFAULT_LOCALE } from '../constants';
import { defaultTheme } from '../mui/theme';

export interface WidgetRenderOptions extends RenderOptions, WidgetProps {}

export function renderWidget(ui: ReactElement, options?: WidgetRenderOptions): RenderResult {
  const props: WidgetRenderOptions = {
    defaultInputTokenAddress: options?.defaultInputTokenAddress ?? {
      1337: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
    defaultOutputTokenAddress: options?.defaultOutputTokenAddress ?? {
      1337: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
    defaultTypedValue: options?.defaultTypedValue ?? {
      1337: parseUnits('2', 6).toString(),
    },
    referrerOptions: options?.referrerOptions ?? {
      [1337]: {
        referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
        fee: '3',
      },
    },
    jsonRpcEndpoint: options?.jsonRpcEndpoint ?? 'http://127.0.0.1:8545',
    theme: options?.theme ?? defaultTheme,
    locale: options?.locale ?? DEFAULT_LOCALE,
    provider: options?.provider,
  };
  const result = render(<Widget {...props}>{ui}</Widget>, options);

  // const rerender = result.rerender;
  // result.rerender = function (this: any, ui: any) {
  //   rerender.call(this, <Widget {...props}>{ui}</Widget>);
  // };

  return result;
}
