export const abi = [
  {
    inputs: [],
    name: 'InvalidOperationForCorePool',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint96',
        name: 'poolId',
        type: 'uint96',
      },
    ],
    name: 'PoolDoesNotExist',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BLOCKS_PER_DAY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VTOKEN_ACTIONS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ComptrollerInterface',
        name: 'comptroller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getAccountLimits',
    outputs: [
      {
        components: [
          {
            internalType: 'contract VToken[]',
            name: 'markets',
            type: 'address[]',
          },
          {
            internalType: 'uint256',
            name: 'liquidity',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'shortfall',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.AccountLimits',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ComptrollerInterface',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'getAllPoolsData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint96',
            name: 'poolId',
            type: 'uint96',
          },
          {
            internalType: 'string',
            name: 'label',
            type: 'string',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'allowCorePoolFallback',
            type: 'bool',
          },
          {
            components: [
              {
                internalType: 'uint96',
                name: 'poolId',
                type: 'uint96',
              },
              {
                internalType: 'string',
                name: 'poolLabel',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'vToken',
                type: 'address',
              },
              {
                internalType: 'bool',
                name: 'isListed',
                type: 'bool',
              },
              {
                internalType: 'uint256',
                name: 'collateralFactor',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isVenus',
                type: 'bool',
              },
              {
                internalType: 'uint256',
                name: 'liquidationThreshold',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'liquidationIncentive',
                type: 'uint256',
              },
              {
                internalType: 'bool',
                name: 'isBorrowAllowed',
                type: 'bool',
              },
            ],
            internalType: 'struct VenusLens.MarketData[]',
            name: 'markets',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct VenusLens.PoolWithMarkets[]',
        name: 'poolsData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract ComptrollerInterface',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'getCorePoolMarketsData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint96',
            name: 'poolId',
            type: 'uint96',
          },
          {
            internalType: 'string',
            name: 'poolLabel',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isListed',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'collateralFactor',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isVenus',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationIncentive',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isBorrowAllowed',
            type: 'bool',
          },
        ],
        internalType: 'struct VenusLens.MarketData[]',
        name: 'result',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'comptrollerAddress',
        type: 'address',
      },
    ],
    name: 'getDailyXVS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint96',
        name: 'poolId',
        type: 'uint96',
      },
      {
        internalType: 'contract ComptrollerInterface',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'getMarketsDataByPool',
    outputs: [
      {
        components: [
          {
            internalType: 'uint96',
            name: 'poolId',
            type: 'uint96',
          },
          {
            internalType: 'string',
            name: 'poolLabel',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isListed',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'collateralFactor',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isVenus',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationIncentive',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isBorrowAllowed',
            type: 'bool',
          },
        ],
        internalType: 'struct VenusLens.MarketData[]',
        name: 'result',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IXVS',
        name: 'xvs',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint32[]',
        name: 'blockNumbers',
        type: 'uint32[]',
      },
    ],
    name: 'getVenusVotes',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'blockNumber',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'votes',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.VenusVotes[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IXVS',
        name: 'xvs',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getXVSBalanceMetadata',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'votes',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'delegate',
            type: 'address',
          },
        ],
        internalType: 'struct VenusLens.XVSBalanceMetadata',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IXVS',
        name: 'xvs',
        type: 'address',
      },
      {
        internalType: 'contract ComptrollerInterface',
        name: 'comptroller',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'getXVSBalanceMetadataExt',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'votes',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'delegate',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'allocated',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.XVSBalanceMetadataExt',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'holder',
        type: 'address',
      },
      {
        internalType: 'contract ComptrollerInterface',
        name: 'comptroller',
        type: 'address',
      },
    ],
    name: 'pendingRewards',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'distributorAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'rewardTokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalRewards',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address',
                name: 'vTokenAddress',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
              },
            ],
            internalType: 'struct VenusLens.PendingReward[]',
            name: 'pendingRewards',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct VenusLens.RewardSummary',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract VToken',
        name: 'vToken',
        type: 'address',
      },
      {
        internalType: 'address payable',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'vTokenBalances',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'balanceOf',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'borrowBalanceCurrent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'balanceOfUnderlying',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenAllowance',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.VTokenBalances',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract VToken[]',
        name: 'vTokens',
        type: 'address[]',
      },
      {
        internalType: 'address payable',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'vTokenBalancesAll',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'balanceOf',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'borrowBalanceCurrent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'balanceOfUnderlying',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenBalance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'tokenAllowance',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.VTokenBalances[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract VToken',
        name: 'vToken',
        type: 'address',
      },
    ],
    name: 'vTokenMetadata',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'exchangeRateCurrent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'supplyRatePerBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'borrowRatePerBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactorMantissa',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrows',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalReserves',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalCash',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isListed',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'collateralFactorMantissa',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'vTokenDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'venusSupplySpeed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'venusBorrowSpeed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dailySupplyXvs',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dailyBorrowXvs',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pausedActions',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThresholdMantissa',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationIncentiveMantissa',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isBorrowAllowed',
            type: 'bool',
          },
          {
            internalType: 'uint96',
            name: 'poolId',
            type: 'uint96',
          },
        ],
        internalType: 'struct VenusLens.VTokenMetadata',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract VToken[]',
        name: 'vTokens',
        type: 'address[]',
      },
    ],
    name: 'vTokenMetadataAll',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'exchangeRateCurrent',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'supplyRatePerBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'borrowRatePerBlock',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactorMantissa',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalBorrows',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalReserves',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalSupply',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'totalCash',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isListed',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'collateralFactorMantissa',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetAddress',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'vTokenDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'venusSupplySpeed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'venusBorrowSpeed',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dailySupplyXvs',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'dailyBorrowXvs',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'pausedActions',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThresholdMantissa',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationIncentiveMantissa',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isBorrowAllowed',
            type: 'bool',
          },
          {
            internalType: 'uint96',
            name: 'poolId',
            type: 'uint96',
          },
        ],
        internalType: 'struct VenusLens.VTokenMetadata[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract VToken',
        name: 'vToken',
        type: 'address',
      },
    ],
    name: 'vTokenUnderlyingPrice',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'underlyingPrice',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.VTokenUnderlyingPrice',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract VToken[]',
        name: 'vTokens',
        type: 'address[]',
      },
    ],
    name: 'vTokenUnderlyingPriceAll',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vToken',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'underlyingPrice',
            type: 'uint256',
          },
        ],
        internalType: 'struct VenusLens.VTokenUnderlyingPrice[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
