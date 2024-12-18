# Venus Protocol Frontend

<p align="center">
  <img src="https://venus.io/share.png">
</p>

Official monorepo for the [Venus protocol](https://venus.io) frontend apps.

## Getting started

### Install dependencies with yarn

```ssh
yarn
```

### Start a development server for the dApp

```ssh
yarn start --filter=@venusprotocol/evm
```

### Start a development server for the landing page

```ssh
yarn start --filter=@venusprotocol/landing
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

Generate production builds

```ssh
yarn build
```
