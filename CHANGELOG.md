## [2.9.2](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.9.1...v2.9.2) (2023-08-04)

## [2.9.1](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.9.0...v2.9.1) (2023-08-03)

## [2.9.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.8.1...v2.9.0) (2023-08-03)


### Features

* make the dApp resilient to the subgraph being down ([7956b20](https://github.com/VenusProtocol/venus-protocol-interface/commit/7956b204f582740fe395b6a039512c7b6fe6599f))


### Bug Fixes

* invalidate correct queries after repaying VAI loan ([2238ff3](https://github.com/VenusProtocol/venus-protocol-interface/commit/2238ff3480ff7eed7cb8316ea52742d24fd2cdd9))

## [2.8.1](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.8.0...v2.8.1) (2023-08-03)

## [2.8.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.7.3...v2.8.0) (2023-08-02)


### Features

* select all claimable rewards when opening modal ([92c5b0f](https://github.com/VenusProtocol/venus-protocol-interface/commit/92c5b0f3dbf1b760aed4492715f60f3b07817b1b))

## [2.7.3](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.7.2...v2.7.3) (2023-08-02)


### Bug Fixes

* let users repay their entire VAI loan ([40b969c](https://github.com/VenusProtocol/venus-protocol-interface/commit/40b969c9b7b2dc842c0b609b13997a05838e6134))

## [2.7.2](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.7.1...v2.7.2) (2023-08-01)


### Bug Fixes

* re-enable hash routing ([de0429f](https://github.com/VenusProtocol/venus-protocol-interface/commit/de0429fcbafbaa5e1bc4bb641c9e369f899d5147))

## [2.7.1](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.7.0...v2.7.1) (2023-07-29)


### Bug Fixes

* use the correct condition for last rewards block ([843c97c](https://github.com/VenusProtocol/venus-protocol-interface/commit/843c97c34f89362fe19432e0638ef75a9a90f2a0))

## [2.7.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.6.1...v2.7.0) (2023-07-27)


### Features

* add useGetSwapRouterContract and useGetGeneriContract hooks ([eacece3](https://github.com/VenusProtocol/venus-protocol-interface/commit/eacece3e1e69305ed33f7af1d814ae1459a1e609))
* remove ETH_MAINNET chain ID from ChainId type ([fcbf3d3](https://github.com/VenusProtocol/venus-protocol-interface/commit/fcbf3d3444820e74408898145b26c930179aeee5))
* update contracts package + create useGetUniqueContract hook ([73a4df7](https://github.com/VenusProtocol/venus-protocol-interface/commit/73a4df7b374564405e6c4cc8322933be0648c6c4))
* update exports of contracts package ([da47b1b](https://github.com/VenusProtocol/venus-protocol-interface/commit/da47b1b80ec792e75eaeccca87dc1d99a1b1daf4))

## [2.6.1](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.6.0...v2.6.1) (2023-07-27)


### Bug Fixes

* add memoization in ProgressBar component to prevent unnecessary re-renders ([637975d](https://github.com/VenusProtocol/venus-protocol-interface/commit/637975d9bdee87379545f9913e62647d02932fb4))
* memoize Trans component to prevent unnecessary re-renders ([a1d9dbe](https://github.com/VenusProtocol/venus-protocol-interface/commit/a1d9dbee0d0362116ad94845a72e7c07924ce5b9))

## [2.6.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.5.0...v2.6.0) (2023-07-26)


### Features

* add tooltips to market table headers ([#1203](https://github.com/VenusProtocol/venus-protocol-interface/issues/1203)) ([e25d5ce](https://github.com/VenusProtocol/venus-protocol-interface/commit/e25d5ce1d61f2067790746be7677a2bd7ac5354b))
* re-enable analytics and error logger + bug fix ([#1205](https://github.com/VenusProtocol/venus-protocol-interface/issues/1205)) ([465492e](https://github.com/VenusProtocol/venus-protocol-interface/commit/465492e904209d2203f3e4ba6aa2249fbdfe2bc8))
* take lastRewardingBlock in consideration ([#1204](https://github.com/VenusProtocol/venus-protocol-interface/issues/1204)) ([302bc21](https://github.com/VenusProtocol/venus-protocol-interface/commit/302bc21791a2be38ce0e36b31ca6d8cf854be6ae))


### Bug Fixes

* design tweaks ([#1207](https://github.com/VenusProtocol/venus-protocol-interface/issues/1207)) ([503b8b6](https://github.com/VenusProtocol/venus-protocol-interface/commit/503b8b65aa38995990c4deba2906bbeee562fa01))

## [2.5.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.4.0...v2.5.0) (2023-07-25)


### Features

* generate contract types from packages ([#1201](https://github.com/VenusProtocol/venus-protocol-interface/issues/1201)) ([ba6b8e9](https://github.com/VenusProtocol/venus-protocol-interface/commit/ba6b8e91a9bbcbc15a2aa3d770088eba6de113e4))

## [2.4.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.3.2...v2.4.0) (2023-07-25)


### Features

* add vankrBNB in DeFi for mainnet and testnet ([#1202](https://github.com/VenusProtocol/venus-protocol-interface/issues/1202)) ([8df0409](https://github.com/VenusProtocol/venus-protocol-interface/commit/8df0409dda00419880b137396bb0d6e4278b037b))

## [2.3.2](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.3.1...v2.3.2) (2023-07-20)


### Bug Fixes

* removed NODE env vars from dockerfiles ([a79501b](https://github.com/VenusProtocol/venus-protocol-interface/commit/a79501b3af8c19a0bb56fc51eeb6435772816c72))

## [2.3.1](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.3.0...v2.3.1) (2023-07-20)


### Bug Fixes

* crash when transaction.tokenAddress is null ([563511a](https://github.com/VenusProtocol/venus-protocol-interface/commit/563511ad2eaf06fae7ec7595b101a502d56ffa24))

## [2.3.0](https://github.com/VenusProtocol/venus-protocol-interface/compare/v2.2.6...v2.3.0) (2023-07-20)


### Features

* update mainnet and testnet RPC URLs ([fcf3ca4](https://github.com/VenusProtocol/venus-protocol-interface/commit/fcf3ca498edd8151ce69276a3017ed481255e318))
