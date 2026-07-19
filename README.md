# Venus Protocol Frontend

<p align="center">
  <img src="https://venus.io/share.png">
</p>

Official monorepo for the [Venus protocol](https://venus.io) frontend apps.

## Getting started

### Install dependencies with yarn

Yarn version is pinned via Corepack. Enable it once on your machine:

```ssh
corepack enable
```

Then install:

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

## AI skills

Launch the interactive AI client:

```sh
yarn ai
```

Use `/login` to connect an LLM provider and `Ctrl+L` to select a model. The client automatically
loads the skills defined in `skills/`; run one with `/skill:<skill-name>`. Use `Ctrl+O` to collapse
or expand tool output.

For example:

```text
/skill:sync-translations
```

### sync-translations

Runs translation extraction, fills entries marked `TRANSLATION NEEDED` from the English source, and
updates other locales when English copy changed on the current branch.

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
