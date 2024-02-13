# Venus Protocol - contracts package

This package exports functions and hooks that can be used to create instances of contracts in order
to fetch data and send transactions.

```typescript
import { useGetGovernorBravoDelegateContract, useGetVTokenContract } from 'libs/contracts';

// Initialize contract instance without a signer
const legacyPoolComptrollerContract = useGetLegacyPoolComptrollerContract();

// Fetch data
if (legacyPoolComptrollerContract) {
  const vTokenAddresses = await legacyPoolComptrollerContract.getAllMarkets();
}

// Initialize contract instance with a signer
const governorBravoDelegateContract = useGetGovernorBravoDelegateContract({
  passSigner: true,
});

// Send transaction
if (governorBravoDelegateContract) {
  await governorBravoDelegateContract.cancel(861);
}
```

After installing dependencies, this package automatically automatically generates a list of contract
functions and hooks using its [config](./config/index.ts).

## Contract types

There are three types of contracts:

### 1. Unique contracts

These represent contracts for which we always use the same address on a given chain.

### 2. Generic contracts

These represent multiple contracts using the same ABIs (e.g.: token contracts). They require an
address in order to be instantiated.

### 3. Swap router

These stem from the unique setup of Venus pools, where each pool uses its dedicated SwapRouter
contract to support the Swap & Supply/Repay features. Thus, they require to be passed the pool's
Comptroller contract address in order to be instantiated.

## Adding a contract

In order to add a new contract to this package, you need to update the
[config file](./config//index.ts). You can then run the next command to generate the contract
functions and hooks:

```ssh
yarn generate-contracts
```
