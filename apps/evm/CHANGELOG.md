# @venusprotocol/evm

## 2.118.0

### Minor Changes

- ac89afc: Update Market navigation
- b851df2: Add blocks into new Market page

### Patch Changes

- fd72e03: Remove local supply/borrow disabled token actions. These will now be fully controlled from contracts
- 24cd069: fix breakpoint prop not being passed to Table component in MarketTable
- 382f4cb: Stop event propagation when clicking on collateral toggle

## 2.117.0

### Minor Changes

- b6f0562: Improve new Market page's design
- ccf2b79: Add TUSD and DAI to Sepolia and Ethereum

### Patch Changes

- 45fefe1: Fix addresses on ankrBNB and WETH on testnet

## 2.116.0

### Minor Changes

- 2a43475: Add query function to fetch utilization rate of a vToken
- 9e5142b: Update header to support new Market page

### Patch Changes

- c09ce8e: Rename StakedEth pool to Staked ETH

## 2.115.0

### Minor Changes

- 72eaf87: Add network statistics to Dashboard
- 00811fd: Add basic structure for new market page

### Patch Changes

- e9761fa: Fix stats on Isolated Pools page

## 2.114.0

### Minor Changes

- 8d42b50: Add support for weETH token on Sepolia and Ethereum

### Patch Changes

- 42861c5: Fix pool tag selection on Dashboard page

## 2.113.3

### Patch Changes

- d0be6dc: Fix calculation of execution ETA when filtering proposals
- ca6f7c5: Design tweaks
- 9eec9f2: Fix user vote fetching on proposals

## 2.113.2

### Patch Changes

- 1f85ef7: Fix CTA labels on Proposal page
- d98a9ed: Fix link to Lido market

## 2.113.1

### Patch Changes

- cdf3898: fix the alignment of the borrow percentage of limit bars
- 4052e50: fix bridge max daily limit when the last transaction happened 24 hours in the past

## 2.113.0

### Minor Changes

- 4b3ccbb: Add error state to Governance page

### Patch Changes

- b427490: Hide paused assets toggle when there are no paused assets
- 0e7d58e: Integration of OKX wallet

## 2.112.1

### Patch Changes

- e5af749: Add Multicall3 contract record on Ethereum

## 2.112.0

### Minor Changes

- 4302b16: Separate Lido pool on Ethereum and Sepolia
- 27c28ab: Add search on Governance page

### Patch Changes

- ec82baa: Log errors when calls to retrieve user balances fail

## 2.111.2

### Patch Changes

- 9969c53: Remove .htaccess file
- 0b9d8cf: fetch VAI and XVS price from contracts on Account page

## 2.111.1

### Patch Changes

- f2b914c: fix label on Repay form when using integrated swap
- fa33fb8: Update distribution reward tooltip

## 2.111.0

### Minor Changes

- 465fb48: filter deprecated markets in BSC testnet
- f0e8c81: Remove LUNA and UST specific logics
- a035bef: Remove collateral modal

### Patch Changes

- dd4f590: Add tooltip on rewards from reward distributors
- cb5cdef: always fetch governance previews using governance chain provider

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
