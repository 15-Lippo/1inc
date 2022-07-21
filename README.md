# 1inch-widget

🧩 Swap widget based on 1inch api

## Options

These are the props you can pass into your `<Widget />` React component


|         Prop          | Type                                     | Value                                                                                                                                         | Default                          |
|:---------------------:|:-----------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------|
| **`jsonRpcEndpoint`** | `string`                                 | In order for a software application to interact with the blockchain, it must connect to node.                                                 | http://localhost:8545/           |
| **`width`**           | `string or number`                       | You can customize the width by passing a number (of pixels) to the width prop of the widget.                                                  | `418`                            |
| **`referrerOptions`** | <pre>{<br>  [chainId: number]: {<br>    "referrerAddress": string,<br>    "fee": string,<br>  }<br>}</pre>| Fee is a number from 1 to 3 percent. <br/> After each swap, a percentage from swap amount equal to fee will be transferred to referrerAddress | <pre>{<br>  1: {<br>    "referrerAddress": "",<br>    "fee": "",<br>  }<br>}</pre> |

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
