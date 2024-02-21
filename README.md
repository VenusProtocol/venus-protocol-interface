# Venus Protocol Frontend

<p align="center">
  <img src="https://venus.io/share.png">
</p>

Official repository for the [Venus protocol](https://venus.io) application.

# TO BE REMOVED

## Getting started

Install dependencies with yarn

```ssh
yarn
```

Start the development server

```ssh
yarn start
```

## Useful commands

Run tests

```ssh
yarn test
```

Check Typescript code

```ssh
yarn tsc
```

Lint code

```ssh
yarn lint
```

Format code

```
yarn format
```

Generate production build

```ssh
yarn build
```

Start application with production build

```ssh
yarn serve
```

## Packages

| Packages                                             | Description                                               |
| ---------------------------------------------------- | --------------------------------------------------------- |
| [contracts](/src/packages/contracts/README.md)       | Generates instances of contracts for each supported chain |
| [tokens](/src/packages/tokens/README.md)             | Generates lists of tokens for each supported chain        |
| [analytics](/src/packages/analytics)                 | Captures analytic events                                  |
| [translations](/src/packages/translations/README.md) | Renders texts in every supported language                 |
| [lunaUstWarning](/src/packages/lunaUstWarning)       | Handles blocking the UI when user has LUNA or UST enabled |
| [wallet](/src/packages/wallet)                       | Handles connection with web3 provider and wallet          |
| [errors](/src/packages/errors)                       | Handles error reporting and displaying error messages     |
