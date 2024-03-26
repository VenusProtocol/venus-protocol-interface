# @venusprotocol/evm

## 2.110.0

### Minor Changes

- 35b0c0a: Rename "deprecated" assets to "paused"
- 4c972b5: remove chainSelect feature flag
- 96d2302: update Prime on Ethereum and Sepolia
- 5a8b92c: update Venus packages and contracts config
- d95e34a: consider feature flag when asking for NativeTokenGateway approval
- 5b11a09: Fetch disabled token actions from contracts
- 558c27a: show LST pool on Ethereum
- 25f7df1: NativeTokenGateway flow fixes
- 6c6dfeb: activate wrapUnwrapNativeToken on BSC_MAINNET
- 3249aa5: hide the "all Prime tokens claimed" warning if the Prime token limit is 0
- 0f8fe29: Update supply mutation function to handle all supply flows
- 7b857f7: Fix withdraw mutation function
- 25a6c79: Fetch proposal previews from subgraph

### Patch Changes

- df0eeed: Enable wrapUnwrapNativeToken feature on all chains
- 060f529: Rename agEUR token to EURA
- 065f69d: Update Create proposal form to accept empty strings

## 2.109.0

### Minor Changes

- 16c1ad4: Update repay mutation function to handle unwrap scenario
- 3ed112d: Add support for Governance subgraph
- 2996aa9: Update borrow mutation function to handle borrow and unwrap flow
- 7b8217d: hide commonTokenBalances section if token list has 2 or less tokens
- ec86402: Update redeem mutation function to handle withdraw and unwrap flow

## 2.108.0

### Minor Changes

- b219c96: Fetch disabled token actions from contracts

## 2.107.0

### Minor Changes

- eb990da: unwrap native token in borrow/withdraw operations

## 2.106.0

### Minor Changes

- fec36e4: Fix governance proposal history
- 30ca2ae: swap page now redirects when switching to a chain that has swap disabled
- 911d718: updated opBNB explorer URLs

### Patch Changes

- 9537bed: Fix evm app version

## 2.105.0

- 5865b86: UI for Governance search
- 5d3eb68: Filter out 0 Prime APYs
- 49a2268: Fix linting issue
- 8516602: Enable supply and borrow actions for TUSD
- 678f33b: move chain logos to wallets lib

## 2.104.0

### Minor Changes

- c433570: Change behaviors of Supply and Repay forms MAX buttons
- 0098840: Replace Prettier and ESLint with Biome

### Patch Changes

- 41030e4: Upgrade Node to 20.x
- e7cd8ec: lint pass with Biome

## 2.103.0

### Minor Changes

- 4010ecc: Fix box shadow on TokenList component of SelectTokenTextField
- b437f08: stricten linting rule on hook dependencies
- 53c1587: ask for approval before unwrapping to native tokens in borrow/withdraw operations

## 2.102.0

### Minor Changes

- 1c4ac58: integrate wrap tokens feature for supply and repay

### Patch Changes

- 3dde06b: Fix a hook's dependency array

## 2.101.0

### Minor Changes

- 1a5dbbc: order markets by their supply APY by default

## 2.100.0

### Minor Changes

- 4d66e04: Enable new VAI page

## 2.99.0

### Minor Changes

- 6d46003: Add Repay VAI tab
- 1bd8875: Filter out LST pool from Ethereum network

### Patch Changes

- 058d801: Update underlying token address of WETH

## 2.98.0

### Minor Changes

- 0aeb39b: Added opBNB mainnet to the list of available chains

## 2.97.0

### Minor Changes

- 85a7f88: Start updating VAI page UI

### Patch Changes

- 04dda84: Improve syncing between wallet and URL chain IDs
- 582419f: Update MATIC token icon

## 2.96.0

### Minor Changes

- d1d477e: Display LegacyPoolComptroller as CorePoolComptroller

## 2.95.2

### Patch Changes

- 973ede4: Fix pagination through URL

## 2.95.1

### Patch Changes

- 82eeaef: Fix responsiveness of Prime promotional banner
- 94cc46e: FIx package versions
- c4e5e18: Stop logging query and mutation errors

## 2.93.0

### Minor Changes

- 9a3a2c4: update operations modals with wrap/unwrap native token feature

### Patch Changes

- 9bc3097: rename packages directory to libs
- da3fd88: Fix changeset GitHub action
