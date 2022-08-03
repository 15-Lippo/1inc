# 1inch-widget

🧩 Swap widget based on 1inch api

## Options

These are the props you can pass into your `<Widget />` React component


|         Prop          | Type                                     | Value                                                                                                                                         | Default                          |
|:---------------------:|:-----------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| **`jsonRpcEndpoint`** | `string`                                 | In order for a software application to interact with the blockchain, it must connect to node.                                                 | http://localhost:8545/           |
| **`width`**           | `string or number`                       | You can customize the width by passing a number (of pixels) to the width prop of the widget.                                                  | `418`                            |
| **`referrerOptions`** | <pre>{<br>  [chainId: number]: {<br>    "referrerAddress": string,<br>    "fee": string,<br>  }<br>}</pre>| Fee is a number from 1 to 3 percent. <br/> After each swap, a percentage from swap amount equal to fee will be transferred to referrerAddress | <pre>{<br>  1: {<br>    "referrerAddress": "",<br>    "fee": "",<br>  }<br>}</pre> |
| **`defaultInputTokenAddress`** | <pre>{<br>  [chainId: string]: {<br>    "defaultInputTokenAddress": string<br>  }<br>}</pre>| Address of the token to be selected by default in the input field (e.g. USDC) for each network chain ID. If left empty the widget will use the native token of the connected chain as default. This can be explicitly defined by the special string 'NATIVE'. For convenience you may pass a single string instead of a chainId mapping.   | ``string or 'NATIVE'`` |
| **`defaultOutputTokenAddress`** | <pre>{<br>  [chainId: string]: {<br>    "defaultOutputTokenAddress": string<br>  }<br>}</pre>| Address of the token to be selected by default in the input field (e.g. USDC) for each network chain ID. None if left empty. Any addresses provided in this parameter must be included in the tokenList. | ``string or 'NATIVE'`` |
| **`defaultTypedValue`** | `BigNumberish` | Number in wei MUST respect the decimals of the defaultInputTokenAddress! If the defaultInputTokenAddress is USDC, defaultTypedValue should be `1000000` or `0x1e8480` (it means 1 USDC). | `0`           |
| **`locale`**          | `SupportedLocale`                       | Specifies an explicit locale to use for the widget interface. This can be set to one of the values exported by the library in SUPPORTED_LOCALES.| `en-US`                        |
## Developing

### Install and start:

1. Create .env according to .env.example
2. Open ```src/index.tsx``` and uncomment Widget component to render it locally
3. ```yarn && yarn start```

### Build
```yarn build```

## Commit rules

Example:

```shell
git commit -m "feat: changed hooks"
```

Subject can not be empty allowed to use `feat`, `fix`, `BREAKING CHANGE` all details here:
https://www.conventionalcommits.org/en/v1.0.0/
