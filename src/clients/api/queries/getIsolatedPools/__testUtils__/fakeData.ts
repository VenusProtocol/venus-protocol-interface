import { abi as comptrollerAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Comptroller.sol/Comptroller.json';
import { abi as poolLensAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Lens/PoolLens.sol/PoolLens.json';
import { abi as rewardsDistributorAbi } from '@venusprotocol/isolated-pools/artifacts/contracts/Rewards/RewardsDistributor.sol/RewardsDistributor.json';
import { BigNumber as BN } from 'ethers';

import { IsolatedPoolParticipantsCountQuery } from 'clients/subgraph';
import { PoolLens } from 'types/contracts';

export const fakeGetAllPoolsOuput = [
  {
    name: 'Pool 1',
    description: '',
    category: '',
    blockPosted: BN.from('0x01ae6542'),
    closeFactor: BN.from('0xb1a2bc2ec50000'),
    comptroller: '0x80C88B6A34fadf3cf5e2086033be8f3d4DC1a195',
    creator: '0x8BDA9f9E1fEF0DFd404Fef338D9fE4c543d172e1',
    liquidationIncentive: BN.from('0x0de0b6b3a7640000'),
    logoURL: '',
    minLiquidatableCollateral: BN.from('0x056bc75e2d63100000'),
    priceOracle: '0xb0de3Fce006d3434342383f941bD22720Ff9Fc0C',
    timestampPosted: BN.from('0x641833ef'),
    vTokens: [
      {
        borrowCaps: BN.from('0x656d8ecddf3279900000'),
        borrowRatePerBlock: BN.from('0x38b3973f'),
        collateralFactorMantissa: BN.from('0x0853a0d2313c0000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0xc55cd9ea33b3eaec0000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0xa8062D2bd49D1D2C6376B444bde19402B38938d0',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x3635c9adc5dea00000'),
        borrowRatePerBlock: BN.from('0x0ce2ff77'),
        collateralFactorMantissa: BN.from('0x09b6e64a8ec60000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x3635c9adc5dea00000'),
        supplyRatePerBlock: BN.from('0x167e40'),
        totalBorrows: BN.from('0x016345785d8a0000'),
        totalCash: BN.from('0x9744943fd3c20000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x4190ab00'),
        underlyingAssetAddress: '0xA808e341e8e723DC6BA0Bb5204Bafc2330d7B8e4',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0x3338988d0beb4419acb8fe624218754053362d06',
        vTokenDecimals: BN.from('0x08'),
      },
    ],
  },
  {
    name: 'Pool 2',
    description: '',
    category: '',
    blockPosted: BN.from('0x01ae6293'),
    closeFactor: BN.from('0xb1a2bc2ec50000'),
    comptroller: '0x019Ea8D2ce806f5496E67af93251D8936905917D',
    creator: '0x8BDA9f9E1fEF0DFd404Fef338D9fE4c543d172e1',
    liquidationIncentive: BN.from('0x0de0b6b3a7640000'),
    logoURL: '',
    minLiquidatableCollateral: BN.from('0x056bc75e2d63100000'),
    priceOracle: '0xb0de3Fce006d3434342383f941bD22720Ff9Fc0C',
    timestampPosted: BN.from('0x64182be2'),
    vTokens: [
      {
        borrowCaps: BN.from('0x027b46536c66c8e3000000'),
        borrowRatePerBlock: BN.from('0x00'),
        collateralFactorMantissa: BN.from('0x09b6e64a8ec60000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x027b46536c66c8e3000000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0xe4a90EB942CF2DA7238e8F6cC9EF510c49FC8B4B',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0x74469281310195a04840daf6edf576f559a3de80',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x056bc75e2d63100000'),
        borrowRatePerBlock: BN.from('0x38b3973f'),
        collateralFactorMantissa: BN.from('0x0853a0d2313c0000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x056bc75e2d63100000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0x167F1F9EF531b3576201aa3146b13c57dbEda514',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x02a24cec731f5322d80000'),
        borrowRatePerBlock: BN.from('0x00'),
        collateralFactorMantissa: BN.from('0x09b6e64a8ec60000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x05ca4ec2a79a7f67000000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0x523027fFdf9B18Aa652dBcd6B92f885009153dA3',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x4fa98a953de2d827c9fc0000'),
        borrowRatePerBlock: BN.from('0x38b3973f'),
        collateralFactorMantissa: BN.from('0x0853a0d2313c0000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x01129a9b4895548cc1f7d40000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0xc440e4F21AFc2C3bDBA1Af7D0E338ED35d3e25bA',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x0c4c182cb9f94619e9480000'),
        borrowRatePerBlock: BN.from('0x38b3973f'),
        collateralFactorMantissa: BN.from('0x0853a0d2313c0000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x4cc4d3f074640e6e5d180000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0xD60cC803d888A3e743F21D0bdE4bF2cAfdEA1F26',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x1190673b5fda900000'),
        borrowRatePerBlock: BN.from('0x38b3973f'),
        collateralFactorMantissa: BN.from('0x0853a0d2313c0000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x03782dace9d90000'),
        supplyCaps: BN.from('0x6a6a18f3948bcc0000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0x2999C176eBf66ecda3a646E70CeB5FF4d5fCFb8C',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
        vTokenDecimals: BN.from('0x08'),
      },
      {
        borrowCaps: BN.from('0x01679e7ac729fb0f140000'),
        borrowRatePerBlock: BN.from('0x00'),
        collateralFactorMantissa: BN.from('0x09b6e64a8ec60000'),
        exchangeRateCurrent: BN.from('0x204fce5e3e25026110000000'),
        isListed: true,
        reserveFactorMantissa: BN.from('0x016345785d8a0000'),
        supplyCaps: BN.from('0x08c505002b79bd4d140000'),
        supplyRatePerBlock: BN.from('0x00'),
        totalBorrows: BN.from('0x00'),
        totalCash: BN.from('0x8ac7230489e80000'),
        totalReserves: BN.from('0x00'),
        totalSupply: BN.from('0x3b9aca00'),
        underlyingAssetAddress: '0x2E2466e22FcbE0732Be385ee2FBb9C59a1098382',
        underlyingDecimals: BN.from('0x12'),
        vToken: '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
        vTokenDecimals: BN.from('0x08'),
      },
    ],
  },
] as unknown as PoolLens.PoolDataStructOutput[];

export const fakeMulticallResponse1 = {
  results: {
    poolLens: {
      originalContractCallContext: {
        reference: 'poolLens',
        contractAddress: '0x7d6A1a595dCa742B4FF4Fb8684e3F018C3c0bEC0',
        abi: poolLensAbi,
        calls: [
          {
            reference: 'vTokenUnderlyingPriceAll',
            methodName: 'vTokenUnderlyingPriceAll(address[])',
            methodParameters: [
              [
                '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
                '0x3338988d0beb4419acb8fe624218754053362d06',
                '0x74469281310195a04840daf6edf576f559a3de80',
                '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
                '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
                '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
                '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
                '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
                '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
              ],
            ],
          },
          {
            reference: 'vTokenBalancesAll',
            methodName: 'vTokenBalancesAll',
            methodParameters: [
              [
                '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
                '0x3338988d0beb4419acb8fe624218754053362d06',
                '0x74469281310195a04840daf6edf576f559a3de80',
                '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
                '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
                '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
                '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
                '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
                '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
              ],
              '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
            ],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: [
            [
              '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
              {
                type: 'BigNumber',
                hex: '0x088ebcd2341ff400',
              },
            ],
            [
              '0x3338988d0beb4419acb8fe624218754053362d06',
              {
                type: 'BigNumber',
                hex: '0x05fa0e50dcecd3770000',
              },
            ],
            [
              '0x74469281310195a04840daf6edf576f559a3de80',
              {
                type: 'BigNumber',
                hex: '0x7b53eac94b0400',
              },
            ],
            [
              '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
              {
                type: 'BigNumber',
                hex: '0x12426999090e17fc00',
              },
            ],
            [
              '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
              {
                type: 'BigNumber',
                hex: '0x06cde0813520d800',
              },
            ],
            [
              '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
              {
                type: 'BigNumber',
                hex: '0x5acdcfbc00',
              },
            ],
            [
              '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
              {
                type: 'BigNumber',
                hex: '0xae4956140c00',
              },
            ],
            [
              '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
              {
                type: 'BigNumber',
                hex: '0x11a509e5ca08857000',
              },
            ],
            [
              '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
              {
                type: 'BigNumber',
                hex: '0x0dc456a89608b800',
              },
            ],
          ],
          decoded: true,
          reference: 'vTokenUnderlyingPriceAll',
          methodName: 'vTokenUnderlyingPriceAll(address[])',
          methodParameters: [
            [
              '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
              '0x3338988d0beb4419acb8fe624218754053362d06',
              '0x74469281310195a04840daf6edf576f559a3de80',
              '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
              '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
              '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
              '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
              '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
              '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
            ],
          ],
          success: true,
        },
        {
          returnValues: [
            [
              '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x3338988d0beb4419acb8fe624218754053362d06',
              {
                type: 'BigNumber',
                hex: '0x05f5e100',
              },
              {
                type: 'BigNumber',
                hex: '0x016345f85c93fc0e',
              },
              {
                type: 'BigNumber',
                hex: '0x0de0b6bc6181c58c',
              },
              {
                type: 'BigNumber',
                hex: '0x9ce8d2993eda0294',
              },
              {
                type: 'BigNumber',
                hex: '0x9b858d20e1500294',
              },
            ],
            [
              '0x74469281310195a04840daf6edf576f559a3de80',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
          ],
          decoded: true,
          reference: 'vTokenBalancesAll',
          methodName: 'vTokenBalancesAll',
          methodParameters: [
            [
              '0x899ddf81dfbbf5889a16d075c352f2b959dd24a4',
              '0x3338988d0beb4419acb8fe624218754053362d06',
              '0x74469281310195a04840daf6edf576f559a3de80',
              '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7',
              '0xb7526572ffe56ab9d7489838bf2e18e3323b441a',
              '0x08e0a5575de71037ae36abfafb516595fe68e5e4',
              '0x2e7222e51c0f6e98610a1543aa3836e092cde62c',
              '0x6d6f697e34145bb95c54e77482d97cc261dc237e',
              '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe',
            ],
            '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
          ],
          success: true,
        },
      ],
    },
    '0x019Ea8D2ce806f5496E67af93251D8936905917D': {
      originalContractCallContext: {
        reference: '0x019Ea8D2ce806f5496E67af93251D8936905917D',
        contractAddress: '0x019Ea8D2ce806f5496E67af93251D8936905917D',
        abi: comptrollerAbi,
        calls: [
          {
            reference: 'getRewardDistributors',
            methodName: 'getRewardDistributors',
            methodParameters: [],
          },
          {
            reference: 'getAssetsIn',
            methodName: 'getAssetsIn(address)',
            methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: [
            '0x26964b3C0a897eef365b65C3390e90563cf09589',
            '0x3986ECDa5Af27a8aDde8785f8d86B8bff6c49306',
          ],
          decoded: true,
          reference: 'getRewardDistributors',
          methodName: 'getRewardDistributors',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          decoded: true,
          reference: 'getAssetsIn',
          methodName: 'getAssetsIn(address)',
          methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
          success: true,
        },
      ],
    },
    '0x80C88B6A34fadf3cf5e2086033be8f3d4DC1a195': {
      originalContractCallContext: {
        reference: '0x80C88B6A34fadf3cf5e2086033be8f3d4DC1a195',
        contractAddress: '0x80C88B6A34fadf3cf5e2086033be8f3d4DC1a195',
        abi: comptrollerAbi,
        calls: [
          {
            reference: 'getRewardDistributors',
            methodName: 'getRewardDistributors',
            methodParameters: [],
          },
          {
            reference: 'getAssetsIn',
            methodName: 'getAssetsIn(address)',
            methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: [
            '0x4B4aF7027fB3c1Fa8F515038b823Ed396ad19e34',
            '0x6a52E48f2C4ab7BDE19a8F847C24F5453A298cA4',
            '0xc43756b32fa8641061b444cb08621574d1faE918',
            '0x853DD0fbf9589d069a38601de13b6C424c58C3A7',
            '0xc7b0106373724a8682F450418b7fD92e31596Bdd',
          ],
          decoded: true,
          reference: 'getRewardDistributors',
          methodName: 'getRewardDistributors',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [],
          decoded: true,
          reference: 'getAssetsIn',
          methodName: 'getAssetsIn(address)',
          methodParameters: ['0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706'],
          success: true,
        },
      ],
    },
  },
  blockNumber: 28326007,
};

export const fakeMulticallResponse2 = {
  results: {
    '0x26964b3C0a897eef365b65C3390e90563cf09589': {
      originalContractCallContext: {
        reference: '0x26964b3C0a897eef365b65C3390e90563cf09589',
        contractAddress: '0x26964b3C0a897eef365b65C3390e90563cf09589',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          success: true,
        },
      ],
    },
    '0x3986ECDa5Af27a8aDde8785f8d86B8bff6c49306': {
      originalContractCallContext: {
        reference: '0x3986ECDa5Af27a8aDde8785f8d86B8bff6c49306',
        contractAddress: '0x3986ECDa5Af27a8aDde8785f8d86B8bff6c49306',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xa8062D2bd49D1D2C6376B444bde19402B38938d0'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc4b20100',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc4b20100',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x899ddf81dfbbf5889a16d075c352f2b959dd24a4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x3338988d0beb4419acb8fe624218754053362d06'],
          success: true,
        },
      ],
    },
    '0x4B4aF7027fB3c1Fa8F515038b823Ed396ad19e34': {
      originalContractCallContext: {
        reference: '0x4B4aF7027fB3c1Fa8F515038b823Ed396ad19e34',
        contractAddress: '0x4B4aF7027fB3c1Fa8F515038b823Ed396ad19e34',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xB9e0E753630434d7863528cc73CB7AC638a7c8ff'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x89173700',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
      ],
    },
    '0x6a52E48f2C4ab7BDE19a8F847C24F5453A298cA4': {
      originalContractCallContext: {
        reference: '0x6a52E48f2C4ab7BDE19a8F847C24F5453A298cA4',
        contractAddress: '0x6a52E48f2C4ab7BDE19a8F847C24F5453A298cA4',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xe4a90EB942CF2DA7238e8F6cC9EF510c49FC8B4B'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x77359400',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x77359400',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x77359400',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x77359400',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
      ],
    },
    '0xc43756b32fa8641061b444cb08621574d1faE918': {
      originalContractCallContext: {
        reference: '0xc43756b32fa8641061b444cb08621574d1faE918',
        contractAddress: '0xc43756b32fa8641061b444cb08621574d1faE918',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x523027fFdf9B18Aa652dBcd6B92f885009153dA3'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x9502f900',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x9502f900',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
      ],
    },
    '0x853DD0fbf9589d069a38601de13b6C424c58C3A7': {
      originalContractCallContext: {
        reference: '0x853DD0fbf9589d069a38601de13b6C424c58C3A7',
        contractAddress: '0x853DD0fbf9589d069a38601de13b6C424c58C3A7',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xc440e4F21AFc2C3bDBA1Af7D0E338ED35d3e25bA'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x83215600',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x83215600',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
      ],
    },
    '0xc7b0106373724a8682F450418b7fD92e31596Bdd': {
      originalContractCallContext: {
        reference: '0xc7b0106373724a8682F450418b7fD92e31596Bdd',
        contractAddress: '0xc7b0106373724a8682F450418b7fD92e31596Bdd',
        abi: rewardsDistributorAbi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xD60cC803d888A3e743F21D0bdE4bF2cAfdEA1F26'],
          decoded: true,
          reference: 'rewardToken',
          methodName: 'rewardToken',
          methodParameters: [],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x74469281310195a04840daf6edf576f559a3de80'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb7526572ffe56ab9d7489838bf2e18e3323b441a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x08e0a5575de71037ae36abfafb516595fe68e5e4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xa0eebb00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xa0eebb00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x2e7222e51c0f6e98610a1543aa3836e092cde62c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x6d6f697e34145bb95c54e77482d97cc261dc237e'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x00',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe'],
          success: true,
        },
      ],
    },
  },
  blockNumber: 28326215,
};

export const fakeIsolatedPoolParticipantsCount: IsolatedPoolParticipantsCountQuery = {
  pools: fakeGetAllPoolsOuput.map(pool => ({
    __typename: 'Pool',
    id: pool.comptroller,
    markets: pool.vTokens.map(({ vToken }) => ({
      id: vToken,
      supplierCount: 10,
      borrowerCount: 20,
    })),
  })),
};
