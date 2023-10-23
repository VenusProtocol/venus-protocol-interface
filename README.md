# Venus Protocol Frontend

<p align="center">
  <img src="https://venus.io/share.png">
</p>

Official repository for the [Venus protocol](https://venus.io) application.

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

| Packages                                       | Description                                               |
| ---------------------------------------------- | --------------------------------------------------------- |
| [contracts](/src/packages/contracts/README.md) | Generates instances of contracts for each supported chain |
| [tokens](/src/packages/tokens/README.md)       | Generates lists of tokens for each supported chain        |
| [analytics](/src/packages/analytics/README.md) | Handles capturing analytic events                         |
