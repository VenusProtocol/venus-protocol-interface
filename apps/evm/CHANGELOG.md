# @venusprotocol/evm

## 2.194.2

### Patch Changes

- a788f5a: handle Framer Motion rename to Motion + fix Storybook package versions

## 2.194.1

### Patch Changes

- 1a921ea: add wUSDM token record

## 2.194.0

### Minor Changes

- 0a7de36: hide icon when there is no vToken logo

## 2.193.2

### Patch Changes

- 8bc70f9: ceil value property of ProgressCircle component

## 2.193.1

### Patch Changes

- b30d5e0: fix multicall batching with viem

## 2.193.0

### Minor Changes

- b41947c: update contracts library to support viem

## 2.192.1

### Patch Changes

- 7660e46: update status text displayed when proposal is waiting for queuing

## 2.192.0

### Minor Changes

- 4c9c844: add support for Merkl distributions

## 2.191.0

### Minor Changes

- cc11b31: update subgraph URLs

## 2.190.2

### Patch Changes

- 44e7973: properly call addOrCopyTokenAction onClick

## 2.190.1

### Patch Changes

- 6b41f63: remove governanceSearch feature flag

## 2.190.0

### Minor Changes

- 548947b: add copy addresses and contract links to market page

## 2.189.2

### Patch Changes

- eb3c02a: remove omnichainGovernance feature flag

## 2.189.1

### Patch Changes

- a682b37: remove posthog

## 2.189.0

### Minor Changes

- 676cc0e: only show high risk warning when borrowing above safe limit

## 2.188.0

### Minor Changes

- 2ee3272: trim token symbol to PT-SolvBTC.BBN-MAR25

## 2.187.0

### Minor Changes

- aa9c8b7: update and enable Base mainnet bridge

## 2.186.0

### Minor Changes

- 0d41199: add sUSDe, PT-USDe-27MAR2025, PT-sUSDE-27MAR2025 and PT-SolvBTC.BBN-27MAR2025

## 2.185.2

### Patch Changes

- e9fe7c8: fix how user settings are persisted
- a0a7cb1: fix how available chains are listed on Bridge page

## 2.185.1

### Patch Changes

- 228bbec: Correct Base governance subgraph URL

## 2.185.0

### Minor Changes

- 5ed4f13: add Base/Base Sepolia networks

## 2.184.0

### Minor Changes

- e973a1b: include generated subgraph types

## 2.183.3

### Patch Changes

- 64aa847: get the right Address entry from the translation file

## 2.183.2

### Patch Changes

- c865e68: reinstate useGetPools hook refactor

## 2.183.1

### Patch Changes

- 8a4601d: avoid trying to resolve names in unsupported chains

## 2.183.0

### Minor Changes

- d028c27: update how borrow cap is displayed on Market page

## 2.182.0

### Minor Changes

- c5ba62e: add Base network metadata

## 2.181.0

### Minor Changes

- eb7758c: fetch web3 domain names for addresses

### Patch Changes

- 58749af: fix border color of RhfSubmitButton when there is an error

## 2.180.2

### Patch Changes

- 2395877: revert changes to market fetching

## 2.180.1

### Patch Changes

- 5606671: fix how isolated pools are detected

## 2.180.0

### Minor Changes

- bdc7665: update useGetPools into a singular fetching hook

### Patch Changes

- 93ac916: reduce layout shift

## 2.179.0

### Minor Changes

- 2b8421b: add indicator on proposals with remote commands awaiting execution

## 2.178.0

### Minor Changes

- 7f5455a: create reusable chains package

### Patch Changes

- 1e548b1: Prevent sending errors from old releases

## 2.177.0

### Minor Changes

- dd2064e: wire up execute button of remote proposals
- dd2064e: add links to transactions in Commands section of Proposal page
- dd2064e: fetch Proposal page data from subgraph
- dd2064e: list omnichain proposals on Proposal page
- dd2064e: display executed payloads counts on proposal list
- dd2064e: split governance subgraphs + remove proposal previews

### Patch Changes

- dd2064e: fix small responsive issues with Governance feature
- dd2064e: fix governance subgraph URLs on Ethereum and Arbitrum One

## 2.176.0

### Minor Changes

- b430c39: add LBTC to Ethereum and Sepolia

## 2.175.3

### Patch Changes

- 79c3018: update BSC governance subgraph URL

## 2.175.2

### Patch Changes

- 108acf5: fix participant counts of legacy pool markets

## 2.175.1

### Patch Changes

- fe719a3: use 6 decimal points in returned value of convertFactorFromSmartContract utility function

## 2.175.0

### Minor Changes

- eff6f5e: reinstate fetching markets from the API

## 2.174.0

### Minor Changes

- 6e7ce8b: display average APYs on Market page

## 2.173.2

### Patch Changes

- c6864a5: fix Storybook + clean up components directory
- c6864a5: upgrade Vite to 5.4.11 and Vitest to 2.1.5

## 2.173.1

### Patch Changes

- cc1e069: fix RPC url on Arbitrum Sepolia

## 2.173.0

### Minor Changes

- 934b7d1: update Markets subgraph URL on zkSync

### Patch Changes

- c950ee9: upgrade Vite to 5.4.11 and Vitest to 2.1.5

## 2.172.2

### Patch Changes

- 5c20a80: use env variable to determine environment

## 2.172.1

### Patch Changes

- 751d73c: remove testId props

## 2.172.0

### Minor Changes

- a3449ea: show borrow and supply cap thresholds on Market page

## 2.171.1

### Patch Changes

- 6021372: fix generic date format

## 2.171.0

### Minor Changes

- abf85a1: add USDC native on zkSync

## 2.170.0

### Minor Changes

- 22cbed2: change vote comment icon

## 2.169.0

### Minor Changes

- bae0fa8: update TWT logo

## 2.168.2

### Patch Changes

- 4a5c6b2: add support for eBTC on Sepolia and Ethereum

## 2.168.1

### Patch Changes

- 7536162: add support for EIGEN token

## 2.168.0

### Minor Changes

- c4729bf: consider limits in both ends of the XVS bridge

## 2.167.2

### Patch Changes

- f50d8b1: Update AddTokenToWalletButton component to handle disconnected state

## 2.167.1

### Patch Changes

- ec940f7: fix account health progress bar

## 2.167.0

### Minor Changes

- fde29cc: use custom account details modal

## 2.166.0

### Minor Changes

- 7fca7f3: add gaslessTransactions user setting

### Patch Changes

- 3bddbff: fix governance subgraph URLs

## 2.165.0

### Minor Changes

- bb5eb3e: display warning on test environments

## 2.164.1

### Patch Changes

- 8c83289: do not attempt to retry when the gas estimation fails

## 2.164.0

### Minor Changes

- f57a93b: add workaround to send gasless transactions with mobile wallets

## 2.163.0

### Minor Changes

- 275a1ea: index dashboard page of the dApp with search engines

## 2.162.0

### Minor Changes

- a8ae482: update transaction error handling

### Patch Changes

- b23f797: design tweaks

## 2.161.0

### Minor Changes

- b3e03d9: integrate with ZyFi gasless txs

## 2.160.0

### Minor Changes

- 2e90bdd: refactor environment variables and config

## 2.159.0

### Minor Changes

- 0483850: enable marketParticipantCounts feature on Optimism mainnet

## 2.158.0

### Minor Changes

- 3bea281: Add support for Optimism networks

### Patch Changes

- 0690e47: fix initial value used when clicking on max button or repay form

## 2.157.0

### Minor Changes

- 813e108: add support for solvBTC token on BSC mainnet and testnet

## 2.156.3

### Patch Changes

- 56dbc43: decouple nested components

## 2.156.2

### Patch Changes

- 771747d: use static RPC provider
- 3cbdb7d: add support for the pufETH token on Ethereum and Sepolia

## 2.156.1

### Patch Changes

- 7dbc230: prevent suppliable and borrowable amounts displayed on forms from going below 0

## 2.156.0

### Minor Changes

- 0f21eb2: refactor value formatting

## 2.155.0

### Minor Changes

- 557cbcf: update columns used in markets tables on Dashboard and Pool pages

## 2.154.1

### Patch Changes

- 678bdac: Fixed the borrow distribution APY value above the chart

## 2.154.0

### Minor Changes

- 26bf2d3: remove unnecessary dependencies

## 2.153.0

### Minor Changes

- 96a56b6: enable APY charts on zkSync

## 2.152.1

### Patch Changes

- ba0c4ea: fix the address used for the V8Treasury contract on zkSync Sepolia

## 2.152.0

### Minor Changes

- 1ca533c: Add support for zkSync networks

## 2.151.1

### Patch Changes

- 8af944c: temporarily fetch markets from contracts

## 2.151.0

### Minor Changes

- 429c37f: Remove Arbitrum One LST pool filter

## 2.150.0

### Minor Changes

- ead7f1f: fetch pools and markets from the API
- a93317b: add support for LST pool on Arbitrum

## 2.149.0

### Minor Changes

- 811e104: unlist LST pool on Arbitrum

## 2.148.0

### Minor Changes

- ccbdf3e: add support weETH and wstETH tokens on BSC networks

## 2.147.0

### Minor Changes

- e6044bb: add native token gateway to LST pool in Arbitrum Sepolia

## 2.146.0

### Minor Changes

- 3b67ef5: remove concept of uncapped borrow and supply caps

## 2.145.0

### Minor Changes

- cb45bed: remove hardcoded unlisted tokens

## 2.144.0

### Minor Changes

- 80343a7: Replace XVS page with XVS daily distribution stat on Dashboard page

### Patch Changes

- 66936b8: reload dApp when lazy load fails
- 9e71065: fix initial redirection

## 2.143.0

### Minor Changes

- 48827a2: fix favicon

### Patch Changes

- 0526bb7: fix link to Lido market on Arbitrum Sepolia

## 2.142.0

### Minor Changes

- 7ddc01c: add postinstall script to evm app

## 2.141.0

### Minor Changes

- 804840c: Integrate ConnectKit

## 2.140.0

### Minor Changes

- a9ca9b2: remove unused code

## 2.139.0

### Minor Changes

- 210b386: disable swap feature on BSC mainnet

## 2.138.0

### Minor Changes

- 1acfd3e: add weETHs token to Sepolia and Ethereum
- ee8accc: Remove History page
- 9724408: enable isolated pools and Lido market on Arbitrum Sepolia

## 2.137.0

### Minor Changes

- fb3ddfd: enable apyCharts for all chains

## 2.136.0

### Minor Changes

- 5421ace: fetch specific chart periods from API
- f1e1a67: detect native token when listing underyling tokens
- 5bb7c7e: Unify reserve properties

## 2.135.0

### Minor Changes

- 0f91f5a: display switch chain CTA on commands

### Patch Changes

- 5662021: calculate utilization rate with the actual market reserves

## 2.134.1

### Patch Changes

- bb30951: fix links to markets in Liquid Staked ETH pool

## 2.134.0

### Minor Changes

- 17fb695: Fix spacings on vaults
- 2600545: Fix breadcrumbs
- 8ec07a3: refactor market snapshot types into possible strings
- 0766702: Add components to display commands on Proposal page
- 5af699b: Add nav item for Lido on Ethereum

### Patch Changes

- 1e199dd: fix alignment on Create proposal modal
- bc36528: fix title of Prime promotional banner on Account page

## 2.133.0

### Minor Changes

- b39baef: Update icon of Aave token

## 2.132.0

### Minor Changes

- ea7b207: hide operations when omnichainGovernance feature is enabled
- ff6eae0: add median user averages for Prime estimations in Ethereum
- 8f39ec2: Add Commands component under Proposal page

### Patch Changes

- 8126a05: Add support for the ezETH token
- 7d39f90: Add omnichainGovernance feature flag

## 2.131.1

### Patch Changes

- 17d34cd: retrieve Prime assets from all pools on Prime calculator page

## 2.131.0

### Minor Changes

- 79be0fd: Enable Prime calculator on Ethereum
- aa42057: update ID of Binance Wallet connector based on environment

## 2.130.1

### Patch Changes

- 547e6b9: Fix liquidation threshold of core pool assets

## 2.130.0

### Minor Changes

- 7ba4802: Upgrade wagmi to v2
- ed684d0: remove newMarketPage feature flag
- 3e0a942: use correct address for native token
- 7a3ebae: Migrate React-Query to v5

### Patch Changes

- 6b64807: add buttons to save token in wallet on Vault page
- 3145325: add support for market subgraph on Arbitrum Sepolia
- 6176843: Fix subgraph URLs used in codegen config

## 2.129.0

### Minor Changes

- 3c0164e: filter out errors from third-party frames + remove unnecessary errors
- 57eb665: Add support for period selection on Market page graphs

### Patch Changes

- 92b9266: Small UI updates
- e8c5a74: hide periods on charts when apyCharts feature is disabled
- 37a4c32: adjust ticket interval on APY charts

## 2.128.0

### Minor Changes

- 3441a9a: Add support for sfrxETH token on Sepolia and Ethereum

### Patch Changes

- e39afb4: update link to documentation on VAI page
- f5622e8: Fix redirections
- 6839eb4: Increase memory allocated to build process of evm app

## 2.127.0

### Minor Changes

- ed08881: fetch asset reserves using treasury balances

### Patch Changes

- a81e6f3: remove "new" label from Bridge nav item
- a97b4e6: Reduce thresholds used for price impacts by half
- 449fc27: Upgrade Yarn and Turbo
- e46dafa: Update icon of rsETH token
- 1771dfd: display correct data on withdraw form when user is disconnected

## 2.126.0

### Minor Changes

- 3272570: Add rsETH token record on Seporia and Ethereum
- cddb5c5: Add support for Arbitrum One network

## 2.125.1

### Patch Changes

- 52e317e: Memoize Supply form initial values to prevent render loop

## 2.125.0

### Minor Changes

- 7eb620f: update offline state of Operation forms
- fafe200: get subgraph URLs from env variables
- 76425cc: hide 0 distributions on new Market page
- bbdc37a: enabled the XVS bridge between all networks
- 1b36d72: Final tweaks following feedbacks on the new Market page before release
- d463219: Remove pending withdrawals from total staked displayed for vesting XVS vaults

### Patch Changes

- 68b09de: Fix z-index of close icon on Prime promotional banner
- 1754fd7: Fix pluralization typo

## 2.124.0

### Minor Changes

- ae8cf22: include token distributions equal to 0

## 2.123.0

### Minor Changes

- 8ca99f0: Add support for Arbitrum and time based rates
- 61c42bc: Disable zoom feature on mobile browsers

## 2.122.0

### Minor Changes

- 77e0e38: Update error handling on Operation form
- 559c6f6: Update logic to display market info in page header
- 65a026a: fix link to transaction from Proposal page
- 952214a: Fix redirection to Dashboard page when page is not found
- be1aaa0: Add liquidation info on new Market page
- da04993: Update new market page navigation
- de35c0a: fix mobile scrolling
- 7fb604d: update Breadcrumbs font size

### Patch Changes

- 427be14: Fix typo in constant name
- b5250e1: remove pending withdrawals when determining amount user can withdraw from XVS vault before losing their Prime token
- 952fc7d: only reset input after submitting Bridge form

## 2.121.0

### Minor Changes

- 9309c37: Update icon of Baby Doge token
- 9972941: add BabyDoge token to BSC mainnet and testnet
- 3f37e82: added Gate wallet

### Patch Changes

- 455c19a: fix typo in the word suppliable
- aa51a2e: Add PT-weETH-26DEC2024 token

## 2.120.1

### Patch Changes

- 14e1ce0: update Discord link

## 2.120.0

### Minor Changes

- 074ccd4: added source=venusprotocol-ui to subgraph URLs
- d73d020: add FRAX and sFRAX to Sepolia

## 2.119.0

### Minor Changes

- a5201ad: Remove the Medium link from the footer
- 1e1db9b: Remove Convert VRT from the navigation menu
- 05e8f84: update operation form
- d1ff9a6: add FRAX and sFRAX to Ethereum

### Patch Changes

- b5dc3c8: Dashboard markets table opens operation modal on click

## 2.118.1

### Patch Changes

- 9d3cd8f: open Operation modal when clicking on asset listed in Account page

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
