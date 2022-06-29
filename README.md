# 1inch-widget

🧩 Swap widget based on 1inch api

## Options

These are the props you can pass into your `<Widget />` React component


| Prop                              | Type               | Value                                                                                         | Default                          |
| :-------------------------------- | :----------------  | :-------------------------------------------------------------------------------------------- | :------------------------------- |
| **`jsonRpcEndpoint`**             | `string`           | In order for a software application to interact with the blockchain, it must connect to node. | http://localhost:8545/      |

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
