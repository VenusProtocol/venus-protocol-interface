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

## UI Development Skills

### ui-develop

Build new UI features from Figma designs (phases 1-2: Plan, Code).

```ssh
/ui-develop <Figma URL or description>
```

### ui-i18n
```ssh
/ui-i18n [feature-name]
```

### ui-qa

Run QA pipeline for UI features (phases 4-6: Preview, Review, Fix). Auto-detects the most recent feature if not specified.

```ssh
/ui-qa [feature-name]
```
