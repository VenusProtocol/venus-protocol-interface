# Venus Protocol

## WARNING FOR CONTRIBUTORS

The Venus protocol interface is currently being redesigned. At the moment our priorities are
refactoring and completing the new site design. We can't guarantee a timely response to unsolicited
pull requests that are not on our roadmap.

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

You’ll need to have Node >16 or later version on your local development machine

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

We use [i18next](https://react.i18next.com/) to translate the app. All the translations are stored
inside [src/assets/translation](src/assets/translations). This means all texts within the app need
to be rendered using the `t` function, returned by `useTranslation`:

```tsx
import { useTranslation } from 'translation';

const Component: React.FC = () => {
  const { t } = useTranslation();

  return <>{t('componentName.textKey')}</>;
};
```

If a text contains HTML or JSX elements, then the `Trans` component can be used instead:

```tsx
import { useTranslation } from 'translation';

const Component: React.FC = () => {
  const { Trans } = useTranslation();

  return (
    <Trans i18nKey="componentName.textKey" components={{ Anchor: <a href="https://acme.com" /> }} />
  );
};
```

If a text needs to be accessed from outside of a component, then the `t` function exported by the
translation client can be used:

```tsx
import { t } from 'translation';

const myFunction () => t('functionName.textKey');
```

Note that this should only be used in cases where we can't use `useTranslation`. The hook does extra
processing, hence why it is preferred in all other cases.

After adding internationalized texts within the app using the methods described, you'll need to
extract the translation keys from the code using the next command:

```sh
yarn extract-translation-keys
```

The new translations will be added to the relevant translation file (e.g.:
[src/assets/translation/en.json](src/assets/translations/en.json)) with a default text, which you'll
need to update with the content you want.

### Automatic contract types

We use [TypeChain](https://github.com/dethcrypto/TypeChain) to automatically generate types for our
contracts, using their ABIs located at `src/constants/contracts/abis`.

Note that the types aren't committed to the repo, since they are rebuilt every time TypeChain
generates them. Instead, they are automatically generated upon installing dependencies. You will
find them at `src/types/contracts`.
