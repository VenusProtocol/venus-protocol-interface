# Venus Protocol Frontend - dApp

<p align="center">
  <img src="https://venus.io/share.png">
</p>

Official repository for the [Venus protocol dApp](https://app.venus.io).

## Getting started

### Set environment variables

Create a `.env` file in the root of the project using the `.env.template` file as a template. You
will need to set environment variables for RPC provider and subgraph URLs, as the ones set by
default in the codebase are only valid for hosted environments.

### Install dependencies with yarn

```ssh
yarn
```

### Start the development server

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

```ssh
yarn format
```

Generate subgraph/contract types and getters

```ssh
# Generate subgraph types
yarn generate-subgraph-types

# Generate contract types and getters
yarn generate-contracts
```

**Do not manually update generated files. They are included in the repository to go along with every
specific version of each app. If the version you are working on needs updated types/getters, use the
commands listed above to automatically update them according to the [subgraph](./codegen.config.ts)
and [contract](./src/libs//contracts//config/index.ts) configurations you've set.**

Extract translation keys into JSON files ([example](./apps/evm/src/libs/translations/translations))

```ssh
yarn extract-translations
```

Generate production build

```ssh
yarn build
```

Start application with production build

```ssh
yarn serve
```
