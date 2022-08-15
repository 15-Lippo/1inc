# Yozh-widget

🧩 Swap widget based on 1inch api

## How to use?

List of supported networks:
```ts
enum SupportedChainId {
    MAINNET = 1,
    ARBITRUM_ONE = 42161,
    OPTIMISM = 10,
    POLYGON = 137,
    BINANCE = 56,
    AVALANCHE = 43114,
    FANTOM = 250,
    GNOSIS = 100,
    LOCALHOST = 1337
}
```
Set default values for each chainId:
```ts
const defaultInputTokenAddress = {
    [SupportedChainId.MAINNET]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    [SupportedChainId.OPTIMISM]: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    ...
  }
  const defaultTypedValue = {
    [SupportedChainId.MAINNET]: '2000',
    [SupportedChainId.OPTIMISM]: '2000',
    ...
  }

  const defaultOutputTokenAddress = {
    [SupportedChainId.MAINNET]: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    [SupportedChainId.OPTIMISM]: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    ...
  }

  const referrerOptions = {
    [SupportedChainId.MAINNET]: {
      referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
      fee: '3',
    },
    [SupportedChainId.OPTIMISM]: {
      referrerAddress: '0xF4da87003DE84337400DB65A2DE41586E3557831',
      fee: '5',
    },
    ...
  }
```
```ts
import { SwapWidget, nereusTheme, SupportedChainId } from '@yozh/1inch-widget';

export default function App() {
  
    return (
      <SwapWidget
        width={400}
        referrerOptions={referrerOptions}
        jsonRpcEndpoint="https://eth-mainnet.alchemyapi.io/v2/..."
        defaultOutputTokenAddress={defaultOutputTokenAddress}
        defaultInputTokenAddress={defaultInputTokenAddress}
        theme={nereusTheme}
        locale="ua"
        provider={provider}
        defaultTypedValue={defaultTypedValue}
    />
)};
```
## Options

These are the props you can pass into your `<Widget />` React component.

Recommended Parameters

|         Prop          | Type                                     | Value                                                                                                                                         | Default                          |
|:---------------------:|:-----------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| **`jsonRpcEndpoint`** | `string`                                 | In order for a software application to interact with the blockchain, it must connect to node.                                                 | http://localhost:8545/           |
| **`provider`**        | `Eip1193Provider or JsonRpcProvider`     | If you don't have a web3 provider yet, the widget has built-in wallet connection functionality that supports MetaMask wallets, making it super simple for you to integrate web3 in your app! |  `Web3Provider` MetaMask |


ALL OPTIONS ARE NOT REQUIRED

|         Prop          | Type                                     | Value                                                                                                                                         | Default                          |
|:---------------------:|:-----------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| **`width`**           | `string or number`                       | You can customize the width by passing a number (of pixels) to the width prop of the widget.                                                  | `418`                            |
| **`referrerOptions`** | <pre>{<br>  [chainId: number]: {<br>    "referrerAddress": string,<br>    "fee": string,<br>  }<br>}</pre>| Fee is a number from 1 to 3 percent. <br/> After each swap, a percentage from swap amount equal to fee will be transferred to referrerAddress | <pre>{<br>  1: {<br>    "referrerAddress": "",<br>    "fee": "",<br>  }<br>}</pre> |
| **`defaultInputTokenAddress`** | <pre>{<br>  [chainId: string]: {<br>    "defaultInputTokenAddress": string<br>  }<br>}</pre>| Address of the token to be selected by default in the input field (e.g. USDC) for each network chain ID. If left empty the widget will use the native token of the connected chain as default. This can be explicitly defined by the special string 'NATIVE'. For convenience you may pass a single string instead of a chainId mapping.   | ``string or 'NATIVE'`` |
| **`defaultOutputTokenAddress`** | <pre>{<br>  [chainId: string]: {<br>    "defaultOutputTokenAddress": string<br>  }<br>}</pre>| Address of the token to be selected by default in the input field (e.g. USDC) for each network chain ID. None if left empty. Any addresses provided in this parameter must be included in the tokenList. | ``string or 'NATIVE'`` |
| **`defaultTypedValue`** | <pre>{<br>  [chainId in SupportedChainId]?: BigNumberish; <br>}</pre> | Value in wei. This value will respect the decimals of the inputTokenAddress. If the defaultInputTokenAddress is USDC, defaultTypedValue should be `1000000` (it means 1 USDC). | `0`           |
| **`locale`**          | `SupportedLocale`                       | Specifies an explicit locale to use for the widget interface. This can be set to one of the values exported by the library in SUPPORTED_LOCALES.| `en`                        |
| **`theme`**          | `Theme`                       | Specifies a custom theme. See [MUI THEME](https://mui.com/material-ui/customization/theming/) |  light `default-theme`                        |


## Developing

### Install and start:

1. Open ```src/index.tsx``` and call the Widget component to render it locally
```ts
const rootElement = document.getElementById('root');
export const root = createRoot(rootElement!);
root.render(
  <Widget>
    <Swap width={400} />
  </Widget>
);
```
2. ```yarn && yarn start```

### Build with microbundle-crl
```yarn build```

### Build with webpack
```yarn build:webpack```


## Commit rules

Example:

```shell
git commit -m "feat: changed hooks"
```

Subject can not be empty allowed to use `feat`, `fix`, `BREAKING CHANGE` all details here:
https://www.conventionalcommits.org/en/v1.0.0/
