# Venus Protocol - chains package

This package lists all the chain-related metadata for the Venus Protocol.

## Chains

Chain IDs are exported via the `ChainId` enum. Chains are exported via the `chains` constant.

```ts
import { chains, ChainId } from '@venusprotocol/chains';

console.log(chains[ChainId.BSC_MAINNET].name); // Outputs "BNB Chain"
```

## Tokens

### Retrieving tokens

Tokens are exported via the `tokens` constant.

```ts
import { tokens, ChainId } from '@venusprotocol/chains';

console.log(tokens[ChainId.BSC_MAINNET][0].symbol); // Outputs "XVS"
```

The library also exports a `getToken` function to retrieve a singular token on a given chain using
its symbol. The `symbol` parameter is not case-sensitive.

```ts
import { getToken, ChainId } from '@venusprotocol/chains';

const xvs = getToken({
  chainId: ChainId.BSC_MAINNET,
  symbol: 'XVS', //
});

console.log(xvs?.symbol); // Outputs "XVS"
```

The icon source of a vToken can be retrieved using the `getVTokenIconSrc` function:

```ts
import { getVTokenIconSrc, ChainId } from '@venusprotocol/chains';

const vTokenIconSrc = getVTokenIconSrc({
  chainId: ChainId.BSC_MAINNET,
  vTokenAddress: '0x6bCa74586218dB34cdB402295796b79663d816e9', // vWBNB market
});
```

### Adding a token

Add the token icon into the [images](./images/tokens) directory, then run the command `yarn
generate` to update the [token manifest](./src/generated/tokenManifest.json). You can then list the
token in any of the [token metadata files](./src/tokens).
