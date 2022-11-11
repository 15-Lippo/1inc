# Contributing
Thank you for your interest in contributing to the 1inch-widget! 🦔

## Development

1. `yarn && yarn start`
In this case, the widget will be connected to contracts deployed in the mainnet networks.

## Connecting to fork

1. Clone repo [helper contract](https://github.com/yozh-io/helper-contracts/tree/deploy) and install dependencies;
2. Create `.env` file in the helper contract repo according to `.env.example`;
3. Run any supported fork using scripts in package.json. Contract will automatically deployed to selected fork https://hardhat.org/hardhat-network/docs/guides/forking-other-networks
4. Create `.env` in 1inch-widget repo and set needed variable. 
For example, if you run `polygon:fork` script - copy deployed contract address and set this address to `REACT_APP_HELPER_CONTRACT_POLYGON`
5. Open `MetaMask` -> `Settings` -> `Networks` and configure your localhost. Example:
```
    RPC: http://127.0.0.1:8545
    ChainId: 137
    Currency symbol: MATIC
```

🤔 If this chain ID is already in use, just remove an original network.
Your localhost should have an id of mainnet (137 for example).

6. Start the widget `yarn start`;
7. Press 'Connect wallet' button, widget will be connected to the fork. After the first start, need to wait a couple of minutes to get all balances from locally deployed contract. The balance must be the same both in the metamask and in the widget. 
8. Now you can swap locally! ✨

## Creating a production build

`yarn build`
- You may also run `yarn build --watch` for feedback in realtime.

## Engineering standards

Code merged into the `main` branch of this repository should adhere to high standards of correctness and maintainability. 
Use your best judgment when applying these standards.
If code is in the critical path, will be frequently visited, or makes large architectural changes, consider following all the standards.

- Have at least one engineer approve of large code refactorings
- At least manually test small code changes, prefer automated tests
- Thoroughly unit test when code is not obviously correct
- If something breaks, add automated tests so it doesn't break again
- Add integration tests for new pages or flows
- Verify that all CI checks pass before merging
- Have at least one product manager or designer approve of any significant UX changes

## Commit rules

Example:

```shell
git commit -m "feat: changed hooks"
```

Subject can not be empty allowed to use `feat`, `fix`, `BREAKING CHANGE` all details here:
https://www.conventionalcommits.org/en/v1.0.0/

## Guidelines

The following points should help guide your development:

- Security: the interface is safe to use
  - Avoid adding unnecessary dependencies due to [supply chain risk](https://github.com/LavaMoat/lavamoat#further-reading-on-software-supplychain-security)
- Reproducibility: anyone can build the interface
  - Avoid adding steps to the development/build processes
  - The build must be deterministic, i.e. a particular commit hash always produces the same build
- Decentralization: anyone can run the interface
  - An Ethereum node should be the only critical dependency 
  - All other external dependencies should only enhance the UX ([graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation))
- Accessibility: anyone can use the interface
  - The interface should be responsive, small and also run well on low performance devices (majority of swaps on mobile!)

## Publishing

In general, fixes and features should be created on a new branch from `main`.
Use the automatic Vercel preview for the branch to collect feedback.  

Fix pull requests should be merged when both ready and tested. 

Features should not be merged until they are both ready for users and tested.
When the feature is ready for review, create a new pull request from the feature branch into `main` and request reviews from the appropriate UX reviewers (PMs or designers).

## Translations

1inch-widget uses [react-i18next](https://react.i18next.com/) for managing translations.


