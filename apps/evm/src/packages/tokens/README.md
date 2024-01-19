# Venus Protocol - tokens package

This package contains the lists of tokens supported on each chain and exports functions and hooks to
get them.

```typescript
import { useGetTokens } from 'packages/tokens';

// Get list of tokens on the currently selected chain
const tokens = useGetTokens();
```

It also lists actions that are disabled for certain tokens
([see information files](./infos//disabledTokenActions/)).

## Adding a token

In order to add a new token to this package, you need to update the [information files](./infos/) of
all the chains you want this token to be supported on. Note: do not update the list of PancakeSwap
tokens on BSC mainnet, it is automatically generated after installing dependencies with the command
`yarn generate-pancake-swap-tokens`.
