# 🧩 1inch-widget

 Swap widget based on 1inch api. Widget for integration into other projects as a separate component, can be used as a standalone application with the ability to add swap protocols.

You can customize the theme to match the style of your application. You can also configure default tokens, referrer address to each network, default typed value in the input and rpc endpoints.

<img src="src/assets/screenshot-nereus-widget.png" height="600"  alt="screenshot"/>

Supported locales: english, ukrainian.

Supported networks:
```
 MAINNET: 1,
 ARBITRUM_ONE: 42161,
 POLYGON: 137,
 BINANCE: 56,
 AVALANCHE: 43114,
 FANTOM: 250
```
Networks GNOSIS (100) and OPTIMISM (10) coming soon.

## How to use Nereus package?

1. Make a build `yarn build`
2. Make an archive `yarn pack`
3. Copy an archive to another directory/directory
4. Set dependency in the package.json like `"@yozh-io/1inch-widget": "file:yozh-io-1inch-widget-v1.1.0.tgz"`
5. Call SwapWidget component: 

```ts
import { SwapWidget, nereusTheme, SupportedChainId } from '@yozh-io/1inch-widget';
import { parseUnits } from '@ethersproject/units';

// Set default values for each chainId:
const defaultInputTokenAddress = {
    [SupportedChainId.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    [SupportedChainId.FANTOM]: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    ...
  }
  const defaultTypedValue = {
    [SupportedChainId.MAINNET]: '1000000000000000000', // value in wei (1 eth on Ethereum mainnet)
    [SupportedChainId.FANTOM]: parseUnits('1', 18).toString(), // the second variant 
    ...
  }

  const defaultOutputTokenAddress = {
    [SupportedChainId.MAINNET]: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    [SupportedChainId.FANTOM]: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ...
  }

  const referrerOptions = {
    [SupportedChainId.MAINNET]: {
      referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
      fee: '3',
    },
    [SupportedChainId.FANTOM]: {
      referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
      fee: '5',
    },
    ...
  }

  const defaultJsonRpcEndpoint = {
    [SupportedChainId.MAINNET]: 'https://eth-mainnet.alchemyapi.io/v2/...',
    [SupportedChainId.FANTOM]: 'https://rpc.ftm.tools',
    ...
  }
export default function App() {
  
    return (
      <SwapWidget
        width={400}
        referrerOptions={referrerOptions}
        jsonRpcEndpoint={defaultJsonRpcEndpoint}
        defaultOutputTokenAddress={defaultOutputTokenAddress}
        defaultInputTokenAddress={defaultInputTokenAddress}
        theme={nereusTheme}
        locale="ua"
        defaultTypedValue={defaultTypedValue}
    />
)};
```

### The main version of the widget is already published. You can install it

`yarn add @yozh-io/1inch-widget`

or

`npm install @yozh-io/1inch-widget`

# Options

These are the props you can pass into your `<SwapWidget />` React component.

_ALL OPTIONS ARE NOT REQUIRED_

|         Prop          | Type                                     | Value                                                                                                                                         | Default                          |
|:---------------------:|:-----------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| **`jsonRpcEndpoint`** | <pre>{<br>  [chainId in SupportedChainId]: string; <br>}</pre> | In order for a software application to interact with the blockchain, it must connect to node.                           | <pre>{<br>  1: 'https://cloudflare-eth.com',<br>  56: 'https://bsc-dataseed1.ninicoin.io',<br>  137: 'https://polygon-rpc.com/',<br>  250: 'https://rpc.ftm.tools',<br>  42161: 'https://arb1.arbitrum.io/rpc',<br>  43114: 'https://api.avax.network/ext/bc/C/rpc',<br>}</pre> |
| **`width`**           | `string or number`                       | You can customize the width by passing a number (of pixels) to the width prop of the widget.                                                  | `418`                            |
| **`referrerOptions`** | <pre>{<br>  [chainId: number]: {<br>    "referrerAddress": string,<br>    "fee": string,<br>  }<br>}</pre>| Fee is a number from 1 to 3 percent. <br/> After each swap, a percentage from swap amount equal to fee will be transferred to referrerAddress | <pre>{<br>  1: {<br>    "referrerAddress": "",<br>    "fee": "",<br>  }<br>}</pre> |
| **`defaultInputTokenAddress`** | <pre>{<br>  [chainId: string]: {<br>    "defaultInputTokenAddress": string<br>  }<br>}</pre>| Address of the token to be selected by default in the input field (e.g. USDC) for each network chain ID. If left empty the widget will use the native token of the connected chain as default. This can be explicitly defined by the special string 'NATIVE'. For convenience you may pass a single string instead of a chainId mapping.   | ``string or 'NATIVE'`` |
| **`defaultOutputTokenAddress`** | <pre>{<br>  [chainId: string]: {<br>    "defaultOutputTokenAddress": string<br>  }<br>}</pre>| Address of the token to be selected by default in the input field (e.g. USDC) for each network chain ID. None if left empty. Any addresses provided in this parameter must be included in the tokenList. | ``string or 'NATIVE'`` |
| **`defaultTypedValue`** | <pre>{<br>  [chainId in SupportedChainId]?: BigNumberish; <br>}</pre> | Value in wei. This value will respect the decimals of the inputTokenAddress. If the defaultInputTokenAddress is USDC, defaultTypedValue should be `1000000` (it means 1 USDC). | `0`           |
| **`locale`**          | `SupportedLocale`                       | Specifies an explicit locale to use for the widget interface. This can be set to one of the values exported by the library in SUPPORTED_LOCALES.| `en`                        |
| **`theme`**          | `Theme`                       | Specifies a custom theme. See [MUI THEME](https://mui.com/material-ui/customization/theming/) |  light `default-theme`                        |

## References

- [YOZH site](https://yozh.io)
- [Api reference](https://docs.1inch.io/docs/aggregation-protocol/api/swagger)

