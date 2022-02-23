# Venus Protocol

## Quick Installation & Start

```sh
npm install
npm run start
```

## Requirements and Configuration

You’ll need to have Node >12.19 or later version on your local development machine

## Creating an App

To create a new app, you may choose one of the following methods:

```
venus-protocol-ui
├── node_modules
├── public
├── src
├──── assets
├──── components
├──── containers
├──── core
├──── utilities
├──── index.js
├──── serviceWorker.js
├── .env
├── .gitignore
├── package.json
├── README.md
```

## Deployment

To deploy, raise a PR to update image and config at: https://github.com/VenusProtocol/venus-k8s-app

## Local Development

Install husky globally to use pre-commit and prepush hooks:

```
npm install -g husky
```

To prepare local environment:

```
cp .env.template .env && yarn install
```

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

### Code Styles
We are enforcing codestyles using eslint and prettier.

### Visual Regression Tests
Visual regressions tests are run by snapshoting storybooks and running diffs against the previous baseline and the new snapshots. A unique story is required to test visual regressions on different prop variations.

If regressions are detected or a new story is added on a PR a review is required after the last commit is pushed. If a new commit is pushed after the PR is approved, it will reset the approval for the new baseline and a new review will be required in order for it to be accepted.
