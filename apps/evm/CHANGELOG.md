# @venusprotocol/evm

## 3.92.0

### Minor Changes

- f3171ff: Add yield-to-maturity APY

## 3.91.0

### Minor Changes

- cd640f6: fix logic to determine if user has enabled asset as collateral

## 3.90.0

### Minor Changes

- 3f5c86c: remove temporary fix for the updated VenusLens contract address

### Patch Changes

- Updated dependencies [3f5c86c]
  - @venusprotocol/chains@0.19.0

## 3.89.1

### Patch Changes

- 8441a51: update VenusLens contract address

## 3.89.0

### Minor Changes

- 9710833: add temporary fix to handle VenusLens address change after Fermi upgrade

### Patch Changes

- Updated dependencies [9710833]
  - @venusprotocol/chains@0.18.0

## 3.88.0

### Minor Changes

- 7634aa1: improve high price impact handling + display USD values of balance updates

## 3.87.0

### Minor Changes

- 55b887e: update banner icon style

## 3.86.0

### Minor Changes

- 40b8379: Add Probable Banner, Isolated-pool sunset tooltip

## 3.85.0

### Minor Changes

- fa54796: update description of isolated pools sunset bannet

## 3.84.0

### Minor Changes

- fd57b15: tailwind css upgrade to v4

### Patch Changes

- fd57b15: fix rocket illustration resolution
- fd57b15: always show user assets only filter
- fd57b15: improve hypothetical yearly earnings calculation
- Updated dependencies [fd57b15]
  - @venusprotocol/chains@0.16.0
  - @venusprotocol/ui@0.7.0

## 3.83.2

### Patch Changes

- a4ad098: remove paused assets from Boost feature

## 3.83.1

### Patch Changes

- 4c7fa86: fix price impact calculation

## 3.83.0

### Minor Changes

- 4e01834: only allow users with pre-existing collateral to open a leveraged position
- 59d69a8: add banner announcing isolated pools sunsetting

### Patch Changes

- 2e7f952: fix issue with incorrect decimals used in approximate-out swaps

## 3.82.0

### Minor Changes

- ce4bfe7: add Ad banner to Pool page

## 3.81.0

### Minor Changes

- 0c85f14: add auto-reload when passing hardforks (updated)

### Patch Changes

- Updated dependencies [0c85f14]
  - @venusprotocol/chains@0.15.0

## 3.80.0

### Minor Changes

- ea8c0df: add auto-reload ui support for new hardforks config

### Patch Changes

- Updated dependencies [ea8c0df]
  - @venusprotocol/chains@0.14.0

## 3.79.0

### Minor Changes

- ba8db91: add Repay with collateral UI

## 3.78.0

### Minor Changes

- 525eb14: support dynamic block times and fermi hardfork/fourier upgrade

### Patch Changes

- Updated dependencies [525eb14]
  - @venusprotocol/chains@0.13.0

## 3.77.0

### Minor Changes

- 95bcede: Replaced Alchemy subgraphs
- eaf9b9f: add base Boost tab

## 3.76.1

### Patch Changes

- bb50f79: remove engines settings from package files so nvmrc file version is used instead

## 3.76.0

### Minor Changes

- 7f260e5: add base Boost tab

## 3.75.2

### Patch Changes

- a1087fe: handle V errors with no exception property

## 3.75.1

### Patch Changes

- eaa97f2: fix issue with repay form showing incorrect balance update

## 3.75.0

### Minor Changes

- 1f0279f: refactor logic to simulate user operations
- 1f0279f: streamline how balance updates are shown on forms

## 3.74.1

### Patch Changes

- d186aaa: fix bug where incorrect collateral factor was being used when E-mode was activated

## 3.74.0

### Minor Changes

- 54ff19b: refactor logic to simulate user operations

## 3.73.0

### Minor Changes

- 773edf6: handle Fourier hardfork on opBNB testnet

### Patch Changes

- Updated dependencies [773edf6]
  - @venusprotocol/chains@0.12.0

## 3.72.0

### Minor Changes

- a402833: fix isBorrowableByUser prop for isolated E-mode groups

## 3.71.0

### Minor Changes

- 99b379a: add support for isolated E-mode groups
- 99b379a: add support for inactive E-mode groups

## 3.70.0

### Minor Changes

- 077eade: add support for isolated E-mode groups

## 3.69.0

### Minor Changes

- 1fe431e: Added helper comments for extract-translations

## 3.68.0

### Minor Changes

- 95b0f57: add SwapDetails component

### Patch Changes

- 74fea72: make token balances optional in SelectTokenTextField component

## 3.67.0

### Minor Changes

- e60e886: Add missing TX types

## 3.66.0

### Minor Changes

- 2257387: add Boost tab to Market page

## 3.65.0

### Minor Changes

- dc04c9f: list vTokens in chains package

### Patch Changes

- Updated dependencies [dc04c9f]
  - @venusprotocol/chains@0.11.0

## 3.64.0

### Minor Changes

- 6f7caac: Support off-chain APYs
- 9ddded0: add Slider component

## 3.63.2

### Patch Changes

- 0c39a61: get liquidation penalty from API

## 3.63.1

### Patch Changes

- a3b9176: fix liquidation penalty not showing on Market page of BSC Core Pool markets

## 3.63.0

### Minor Changes

- f7484bd: Fixed WBNB burn converter destination address

## 3.62.0

### Minor Changes

- c82212a: improve error handling
- bd9590d: publish chains package

### Patch Changes

- Updated dependencies [bd9590d]
  - @venusprotocol/chains@0.9.0

## 3.61.0

### Minor Changes

- 4b57f88: display collateral status of E-mode markets

## 3.60.1

### Patch Changes

- 3f24ab1: remove "new" label from Port feature

## 3.60.0

### Minor Changes

- f911647: Added support for intrinsic APYs

## 3.59.1

### Patch Changes

- 306cef5: fix footer link keys

## 3.59.0

### Minor Changes

- e9849d3: add legal page links to dApp's footer

## 3.58.1

### Patch Changes

- 8c73da5: ask user risk acknowledgement when needed

## 3.58.0

### Minor Changes

- e394f88: account for VAI in E-mode

## 3.57.1

### Patch Changes

- e43bcbc: only show acknowledgement component when needed

## 3.57.0

### Minor Changes

- a069c26: enable E-mode feature on BNB Chain

## 3.56.0

### Minor Changes

- ce96aef: update E-mode feature

## 3.55.0

### Minor Changes

- 07fe8ac: add PT-USDe-30OCT2025 token record

## 3.54.2

### Patch Changes

- 613dfd2: fix issue with greyed out borrow APYs

## 3.54.1

### Patch Changes

- ead6f6b: fix issue with optional E-mode settings

## 3.54.0

### Minor Changes

- f241bdd: wire up E-mode feature

## 3.53.3

### Patch Changes

- 1e56c20: show 0% Prime APYs for markets user participates in

## 3.53.2

### Patch Changes

- 8e70d81: fix padding issue on Market page header

## 3.53.1

### Patch Changes

- 34bb69c: prioritize price from oracle when calculating distributions

## 3.53.0

### Minor Changes

- 90a35a2: feat: add E-mode promotional banner to Borrow form

## 3.52.0

### Minor Changes

- a2f5f39: use authenticated Safe endpoint

## 3.51.0

### Minor Changes

- e863986: add group logic to E-mode

## 3.50.1

### Patch Changes

- 814e75e: fix tab search param initialisation

## 3.50.0

### Minor Changes

- cd4da15: Added account transactions tab

## 3.49.0

### Minor Changes

- 21044ab: add Core Pool WBNB market NativeTokenGateway contract record

### Patch Changes

- 3ab9bda: remove newAccountPage feature flag

## 3.48.0

### Minor Changes

- 473d589: improve Tabs to handle search param nav
- 2edd0a4: add E-mode banner to Account page

## 3.47.0

### Minor Changes

- d4d94c5: add E-mode group info to Market page

## 3.46.0

### Minor Changes

- d85540d: add logic to handle E-mode groups

## 3.45.0

### Minor Changes

- 656bb1a: add E-mode UI elements

## 3.44.0

### Minor Changes

- 666099f: restore VSolvBTC from vTokenBalancesAll call

## 3.43.0

### Minor Changes

- 6efa799: filter VSolvBTC from vTokenBalancesAll call

## 3.42.0

### Minor Changes

- 79417af: add E-mode banner

## 3.41.1

### Patch Changes

- c69ece7: only attempt to fetch VAI repay APR if VAI Controller address exists

## 3.41.0

### Minor Changes

- 8cc6be0: remove minus sign from readable daily change percentage on Account page

## 3.40.0

### Minor Changes

- 574e424: updated page architecture

### Patch Changes

- Updated dependencies [574e424]
  - @venusprotocol/chains@0.8.0

## 3.39.0

### Minor Changes

- 359f278: account page UI fixes

### Patch Changes

- Updated dependencies [359f278]
  - @venusprotocol/ui@0.6.0

## 3.38.0

### Minor Changes

- fea4268: manually track pageview analytic events

## 3.37.0

### Minor Changes

- f9d4941: fetch and display account performance over time

## 3.36.0

### Minor Changes

- 7ef2067: keep analytic IDs between apps

## 3.35.0

### Minor Changes

- 9414914: update icon used on new Account page placeholder
- 31682e8: add Settings tab to new Account page
- 1a9a121: remove Berachain-related code

### Patch Changes

- b7a861d: also load Prime status
- Updated dependencies [1a9a121]
  - @venusprotocol/chains@0.7.0
  - @venusprotocol/ui@0.5.0

## 3.34.0

### Minor Changes

- a2629cd: add Prime banner to new Account page

## 3.33.0

### Minor Changes

- e37b327: send analytic events when performing risky action

## 3.32.0

### Minor Changes

- 68f607c: send analytic events related to wallet actions

## 3.31.0

### Minor Changes

- aa3de8b: remove walletAddress from analytic events
- 5ad1eb3: add pools to new Account page

### Patch Changes

- 18922e5: only fetch VAI borrow balance if VAI vault exists
- Updated dependencies [5ad1eb3]
  - @venusprotocol/ui@0.4.0

## 3.30.0

### Minor Changes

- cf170d0: add vaults to new Account page

## 3.29.0

### Minor Changes

- 42676aa: update core analytic events

## 3.28.0

### Minor Changes

- 31a61c6: add performance chart to new Account page

## 3.27.2

### Patch Changes

- 7816ebf: use config to detect production environment

## 3.27.1

### Patch Changes

- 878bd98: fix treasury balance
- cdb7338: only fetch burned BNB when feature is enabled

## 3.27.0

### Minor Changes

- 7641339: Read badDebt from the API

### Patch Changes

- 39f3c41: only fetch PancakeSwap pairs when integrated swap feature is enabled

## 3.26.0

### Minor Changes

- 7400716: update Biconomy config to work with MetaMask smart accounts

## 3.25.0

### Minor Changes

- b397745: add structure for new Account page
- d68954c: Filter inactive rewards from market info

### Patch Changes

- b945f34: change name of failed import event

## 3.24.0

### Minor Changes

- 5a2cc4d: Removed unused code in the supply form
- 883675f: remove Google Tag manager and Vercel Analytics
- ad0325e: Series of desktop UI/UX enhancements
- 7c5c2b4: increase Port limit to $100k + UI improvements
- ad723ff: governance UI/UX improvements
- 5a07350: include underlying balance of treasury vTokens to treasury balance
- c3433cb: consolidate pool and market pages
- 71d6547: Multiple fixes and improvements for the mobile web UI
- a293ef9: Capture paths in analytics
- a93b5d6: Round intervals division in the market charts

### Patch Changes

- 043d3c3: fix bottom padding of top bar
- 1e4bca3: update icon of market table placeholder
- Updated dependencies [c3433cb]
  - @venusprotocol/chains@0.6.0

## 3.23.0

### Minor Changes

- c268fc9: remove Unichain banner

## 3.22.0

### Minor Changes

- 64e78b2: enable PostHog analytics again
- 4e75fd0: Use the new API token price structure

## 3.21.2

### Patch Changes

- 50b4835: track errors related to tracking transactions

## 3.21.1

### Patch Changes

- 79faaec: update burned BNB banner content

## 3.21.0

### Minor Changes

- 4e854bd: stop logging warning headers on sentry

## 3.20.1

### Patch Changes

- d0539ee: fix APY percentage sent in analytics when importing position

## 3.20.0

### Minor Changes

- 1aa9678: add burned BNB banner

## 3.19.0

### Minor Changes

- f304cc4: only show import position modal if user has importable positions

## 3.18.0

### Minor Changes

- b2b2ddd: always show Import page

## 3.17.0

### Minor Changes

- 42b4ff0: use temporary address for the vBNB underlying

## 3.16.0

### Minor Changes

- a237d0e: add controls and placeholder to MarketTable
- d317cc8: add burned BNB button
- d317cc8: add analytics and boundaries to Import Positions feature
- d317cc8: wire up Import positions feature

## 3.15.0

### Minor Changes

- b33203a: use NodeReal RPCs primarily

## 3.14.0

### Minor Changes

- acc7a59: add burned BNB button

## 3.13.0

### Minor Changes

- 43502d0: add Alchemy RPC to all mainnet chains

### Patch Changes

- 837cd2b: ugrade Wagmi to latest version
- Updated dependencies [0a11f7f]
  - @venusprotocol/chains@0.5.1

## 3.12.0

### Minor Changes

- e474ad7: renamed USDT to USD₮0 in Arbitrum

## 3.11.0

### Minor Changes

- 7438fc7: add UI for the Import Positions modal

## 3.10.0

### Minor Changes

- bc1926b: add support for USDF on BNB Chain

## 3.9.0

### Minor Changes

- 58d6a06: add support for USD₮0 and WBTC on Unichain network

## 3.8.0

### Minor Changes

- 2cd83aa: add support for Maxwell Fork of the BNB Chain

### Patch Changes

- Updated dependencies [2cd83aa]
  - @venusprotocol/chains@0.5.0

## 3.7.0

### Minor Changes

- f89d315: display canceled remote commands in proposal list

## 3.6.0

### Minor Changes

- 5627ad5: add support for USDe on Ethereum and Sepolia instead of Unichain mainnet and sepolia

## 3.5.0

### Minor Changes

- fd34736: add tBTC (Ethereum) and xSolvBTC (BNB)

## 3.4.0

### Minor Changes

- b261d21: add support for Google Tag Manager

## 3.3.0

### Minor Changes

- 9f94fa5: allow enter and exit market actions to be disabled

## 3.2.1

### Patch Changes

- 6634d26: upgrade React to v19

## 3.2.0

### Minor Changes

- fa1247d: better types for getContractAddress

## 3.1.1

### Patch Changes

- 4a3baca: fix finding lowercased addresses in getContractAddress

## 3.1.0

### Minor Changes

- f8090dd: remove ethers.js

## 3.0.0

### Major Changes

- 53dcf9a: use Alchemy testnet governance subgraphs

## 2.262.0

### Minor Changes

- 2cc00c3: refactor mutation functions to you use viem

## 2.261.0

### Minor Changes

- b576bc5: add support for USDe on Unichain

## 2.260.0

### Minor Changes

- 9f1e690: refactor some mutation functions to use viem

## 2.259.0

### Minor Changes

- ca92cd2: add support for weETH and wstETH on Unichain
- 97dd523: update Twitter to X

## 2.258.0

### Minor Changes

- 70df008: refactor useClaimRewards to use viem

## 2.257.0

### Minor Changes

- 82f4f31: refactor some mutation functions to use viem

## 2.256.0

### Minor Changes

- 7ef8def: add metadata for Berachain Mainnet and Bepolia

### Patch Changes

- Updated dependencies [7ef8def]
  - @venusprotocol/chains@0.4.0

## 2.255.1

### Patch Changes

- f2ef110: only render Isolated Pools page when feature is enabled

## 2.255.0

### Minor Changes

- 27d97d8: add support for USD1 on BNB Chain networks

## 2.254.0

### Minor Changes

- 73ec982: refactor some mutation functions to use viem

## 2.253.4

### Patch Changes

- 496a172: relist zkETH on ZKsync

## 2.253.3

### Patch Changes

- d7d7901: temporarily unlist zkETH on ZKsync

## 2.253.2

### Patch Changes

- 11f462e: temporarily disable zkETH market on ZKsync

## 2.253.1

### Patch Changes

- 68d1935: remove Convert VRT page

## 2.253.0

### Minor Changes

- b92e478: add back account health bar

## 2.252.0

### Minor Changes

- ba7f137: show account health factor

### Patch Changes

- Updated dependencies [ba7f137]
  - @venusprotocol/ui@0.3.0

## 2.251.0

### Minor Changes

- 948df0f: reinstate APY charts in opBNB mainnet

## 2.250.0

### Minor Changes

- dd065a3: add Aster points

## 2.249.0

### Minor Changes

- fe93136: set gas limit when sending transactions

## 2.248.4

### Patch Changes

- 2a5d848: prevent sending transactions with empty access list

## 2.248.3

### Patch Changes

- 7f9c80e: refactor getPendinRewards to use viem

## 2.248.2

### Patch Changes

- 587b896: update RPC providers order for opBNB mainnet

## 2.248.1

### Patch Changes

- 7bd49a8: disable APY charts on opBNB

## 2.248.0

### Minor Changes

- c3a7872: add support for automatic chain upgrades

### Patch Changes

- c959d04: remove title from Account page section + update margins
- Updated dependencies [c3a7872]
  - @venusprotocol/chains@0.2.0

## 2.247.0

### Minor Changes

- b7ca953: add support for PT-sUSDE, USDe and sUSDe on BNB Chain

## 2.246.0

### Minor Changes

- 5dc5207: refactor some query functions to use viem

## 2.245.1

### Patch Changes

- e8514d6: regenerate subgraph types

## 2.245.0

### Minor Changes

- 50836c2: allow mutation functions to be written using viem

## 2.244.1

### Patch Changes

- b74b3c4: upgrade viteJS and vitest to their latest versions

## 2.244.0

### Minor Changes

- addb300: use usePublicClient hook

## 2.243.1

### Patch Changes

- 93e7b3b: fix how imported proposal action data is parsed

## 2.243.0

### Minor Changes

- 7e9986d: replace subgraphs with API for borrowers and suppliers counts

### Patch Changes

- ed4b995: refactor some query functions to use viem

## 2.242.0

### Minor Changes

- c7b5b25: allow multiple RPC provider URLs for each chain

### Patch Changes

- 93b359f: fix icon used on "against" votes

## 2.241.0

### Minor Changes

- 9a385fd: enable analytic events in production hosts
- bd4a6a8: refactor some query functions to use viem and named exports

## 2.240.0

### Minor Changes

- e695ba6: enable Vercel analytics

## 2.239.0

### Minor Changes

- f998df5: add support for Safe

## 2.238.0

### Minor Changes

- 3280683: increase reward fetching interval

## 2.237.0

### Minor Changes

- 1b373e7: remove unused query keys

## 2.236.0

### Minor Changes

- 6f2abc0: refactor some query functions to use viem

### Patch Changes

- b8f6d94: fix alignment issue on pool tables on Account page

## 2.235.0

### Minor Changes

- ce19a88: fetch points distributions from API

## 2.234.0

### Minor Changes

- b51f383: add asBNB and PT-clisBNB-APR25 records

## 2.233.0

### Minor Changes

- 75d032d: fix how proposal actions are parsed

## 2.232.3

### Patch Changes

- 84308b6: update fallback mechanism of the ethers.js provider

## 2.232.2

### Patch Changes

- b753dcc: update zkSync name to ZKsync
- Updated dependencies [b753dcc]
  - @venusprotocol/chains@0.1.1

## 2.232.1

### Patch Changes

- 07b8d8f: filter out inactive reward campaigns

## 2.232.0

### Minor Changes

- 4ba7fa5: increase minimum Paymaster balance to enable gasless transactions

## 2.231.0

### Minor Changes

- d584d0d: display and claim user rewards from Merkl

## 2.230.0

### Minor Changes

- f186baa: use price endpoint in getPendingRewards

## 2.229.0

### Minor Changes

- 6084ca2: add fallback mechanism for RPC providers

### Patch Changes

- 4ffdab3: add Omnichain Governor contract record

## 2.228.0

### Minor Changes

- f335660: add UI package

### Patch Changes

- Updated dependencies [f335660]
  - @venusprotocol/ui@0.2.0

## 2.227.0

### Minor Changes

- 6f167ec: add mtwCARROT to Ethereum

## 2.226.0

### Minor Changes

- 7399880: add Ethena points to sUSDe

## 2.225.1

### Patch Changes

- 63481ca: fix issue with actions not getting correctly formatted in proposal preview

## 2.225.0

### Minor Changes

- 4a4dc88: add Unichain governance subgraph

## 2.224.1

### Patch Changes

- 01c8c1f: only allow showing warning on Proposal page when user can vote

## 2.224.0

### Minor Changes

- 97954dc: fetch BSC Core pool participant counts from subgraph

## 2.223.0

### Minor Changes

- 5004227: add new underlying tokens

## 2.222.0

### Minor Changes

- a8e45c5: update behavior to switch chains

## 2.221.1

### Patch Changes

- 013317e: pause wUSDM on zkSync

## 2.221.0

### Minor Changes

- 1c4f3a8: refactor logic linked to governance to use viem

## 2.220.0

### Minor Changes

- 778b4e6: refator some query functions to use viem

## 2.219.0

### Minor Changes

- 9e3f6ae: fix issue where ready to be executed proposals would show the wrong icon

## 2.218.0

### Minor Changes

- 2f6b9d3: add UNI token to Unichain

## 2.217.0

### Minor Changes

- 43921ad: enable bridge on Unichain mainnet

## 2.216.0

### Minor Changes

- 07e1300: add URL of Unichain Sepolia subgraph

### Patch Changes

- 108d6e4: scale Unichain background with resolution

## 2.215.2

### Patch Changes

- 7110cbc: update Unichain subgraph URL to point specific deployment

## 2.215.1

### Patch Changes

- 07feac9: reduce height of Dashboard carousel

## 2.215.0

### Minor Changes

- 51cfd5b: add background illustration when connected to Unichain network

## 2.214.4

### Patch Changes

- eb93f9b: Filter errors thrown from canceled fetch requests

## 2.214.3

### Patch Changes

- be854d5: replace heavy SVG token icons with PNGs

## 2.214.2

### Patch Changes

- 7542375: Use SafePal Android friendly QR code colors when connecting wallets

## 2.214.1

### Patch Changes

- 067fd4a: fix style of token contract buttons on Market page
- e43b3c2: fix failed remote proposal state detection
- ef5bb3e: add points distribution for weETHs market in Core Pool on ETH

## 2.214.0

### Minor Changes

- 68311e8: add Unichain promotional material
- e0b7075: add Unichain

### Patch Changes

- Updated dependencies [68311e8]
  - @venusprotocol/chains@0.1.0

## 2.213.0

### Minor Changes

- d4480c4: update BSC governance subgraph URL

## 2.212.0

### Minor Changes

- aa0db99: add point distributions

## 2.211.0

### Minor Changes

- 870c792: add Carousel component

## 2.210.0

### Minor Changes

- 26345b7: rework toolip component
- d16fd97: bump wagmi and viem

## 2.209.1

### Patch Changes

- d54a89c: remove log command from a test

## 2.209.0

### Minor Changes

- e71b2d5: add Yearn tokens on Ethereum

## 2.208.0

### Minor Changes

- 54328a1: update expiral logic for Merkl rewards

## 2.207.0

### Minor Changes

- 76da055: add support for SOL
- 2747ace: handle failed remote proposals

## 2.206.0

### Minor Changes

- 82183e2: filter inactive rewards

## 2.205.0

### Minor Changes

- 564ac24: add support for BAL token
- f80ff51: fix issue with floating-point collateral factors

## 2.204.0

### Minor Changes

- 7afbe6c: refactor some query functions to use viem

## 2.203.0

### Minor Changes

- e8530b8: improve APY boost feature
- e8530b8: update APY boost feature UI

## 2.202.0

### Minor Changes

- c48a1bf: add sUSDS and USDS to Ethereum

## 2.201.0

### Minor Changes

- 09a4892: add wsuperOETHb to Base

### Patch Changes

- fb19568: fix Base Sepolia subgraph URLs

## 2.200.0

### Minor Changes

- f335a9f: add icons of token distributions

### Patch Changes

- 59148cb: fix Mock import from vitest

## 2.199.0

### Minor Changes

- 010c4c9: fix APY boost feature for Prime users

## 2.198.0

### Minor Changes

- 6afe58a: highlight markets with boosted APYs

## 2.197.0

### Minor Changes

- d32b905: update GMX token icons
- f60615c: update Thena token assets

## 2.196.0

### Minor Changes

- da87a43: refactor query function to fetch pools

## 2.195.0

### Minor Changes

- 16a02a6: add gmBTC-USDC and gmWETH-USDC to Arbitrum
- 123dff7: correct vUSDC and vUSDC.e vToken logos on zkSync

## 2.194.4

### Patch Changes

- d362af7: make Toggle component light by default

## 2.194.3

### Patch Changes

- beaab17: update Market Details page

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
