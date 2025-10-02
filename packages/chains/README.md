# Venus Protocol - chains package

This package lists all the chain-related metadata for the Venus Protocol.

## Tokens

### Adding a token

Add the token icon into the [public](./public/img/tokens) directory, then run the command `yarn generate` to update the [token manifest](./src/generated/tokenManifest.json). You can then list the token in any of the [token metadata files](./src/tokens).
