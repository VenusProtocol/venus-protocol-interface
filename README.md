# Venus Protocol

## Quick Installation & Start

Install [make](https://www.npmjs.com/package/make) and [husky](https://www.npmjs.com/package/husky)
globally:

```sh
npm i make -g && npm i husky -g && husky install
```

Install dependencies

```sh
yarn
```

Prepare local environment:

```
cp .env.template .env
```

## Requirements and Configuration

You’ll need to have Node >12.19 or later version on your local development machine

## Deployment

To deploy, raise a PR to update image and config at: https://github.com/VenusProtocol/venus-k8s-app

## Local Development

To run local development:

```
yarn start
```

To run local storybook:

```
yarn storybook
```

To run dev environment:

```
docker compose up venus-ui-dev
```

To run prod environment:

```
docker compose build && docker compose up venus-ui-prod
```

## Testing

Tests run in CI on push using Github actions. They are all required to pass.

### Typescript

Types are checked by running `tsc`.

### Code Style

We are enforcing code styles using eslint, prettier and stylelint.

### Visual Regression Tests

Visual regressions tests are run by snapshoting storybooks and running diffs against the previous
baseline and the new snapshots. A unique story is required to test visual regressions on different
prop variations.

If regressions are detected or a new story is added on a PR a review is required after the last
commit is pushed. If a new commit is pushed after the PR is approved, it will reset the approval for
the new baseline and a new review will be required in order for it to be accepted.

### Internationalization

TO DO
