import { contractInfos } from 'packages/contracts';

import fakePoolLensContractResponses from '__mocks__/contracts/poolLens';
import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';

export const fakeMulticallResponse0 = {
  results: {
    poolLens: {
      originalContractCallContext: {
        reference: 'poolLens',
        contractAddress: '0x559936086C5f65b92240012ae0D2F70C082Ac0b0',
        abi: contractInfos.poolLens.abi,
        calls: [
          {
            reference: 'vTokenBalancesAll',
            methodName: 'vTokenBalancesAll',
            methodParameters: [
              [
                '0x170d3b2da05cc2124334240fB34ad1359e34C562',
                '0x3338988d0beb4419Acb8fE624218754053362D06',
                '0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4',
                '0xEF949287834Be010C1A5EDd757c385FB9b644E4A',
                '0x5e68913fbbfb91af30366ab1B21324410b49a308',
                '0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a',
                '0x80CC30811e362aC9aB857C3d7875CbcCc0b65750',
                '0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E',
                '0xb677e080148368EeeE70fA3865d07E92c6500174',
                '0x1958035231E125830bA5d17D168cEa07Bb42184a',
                '0xef470AbC365F88e4582D8027172a392C473A5B53',
                '0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634',
                '0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a',
                '0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47',
                '0x644A149853E5507AdF3e682218b8AC86cdD62951',
                '0x75aa42c832a8911B77219DbeBABBB40040d16987',
                '0x231dED0Dfc99634e52EE1a1329586bc970d773b3',
                '0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c',
                '0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD',
                '0x47793540757c6E6D84155B33cd8D9535CFdb9334',
                '0xEe543D5de2Dbb5b07675Fc72831A2f1812428393',
                '0x410286c43a525E1DCC7468a9B091C111C8324cd1',
                '0x712774CBFFCBD60e9825871CcEFF2F917442b2c3',
                '0xD804F74fe21290d213c46610ab171f7c2EeEBDE7',
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
              '0x170d3b2da05cc2124334240fB34ad1359e34C562',
              {
                type: 'BigNumber',
                hex: '0xe8d4a51000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
              {
                type: 'BigNumber',
                hex: '0x021ed931d8f9d6e2faf1',
              },
              {
                type: 'BigNumber',
                hex: '0x1501b26da69385640000',
              },
              {
                type: 'BigNumber',
                hex: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
              },
            ],
            [
              '0x3338988d0beb4419Acb8fE624218754053362D06',
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
                hex: '0x204fb9313b5d351530a0a478',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4',
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
                hex: '0x1db041d9c4ad0904427b',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xEF949287834Be010C1A5EDd757c385FB9b644E4A',
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
                hex: '0x54cc7020acf817c80000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x5e68913fbbfb91af30366ab1B21324410b49a308',
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
                hex: '0x0192f9d632c1e1e7600000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a',
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
                hex: '0x047006ebda5a7df00000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x80CC30811e362aC9aB857C3d7875CbcCc0b65750',
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
                hex: '0x204fb9313b5d351530a0a478',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E',
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
                hex: '0x1db041d9c4ad0904427b',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xb677e080148368EeeE70fA3865d07E92c6500174',
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
                hex: '0xd3c21bcecceda1000000',
              },
              {
                type: 'BigNumber',
                hex: '0x0de0b6b3a7640000',
              },
            ],
            [
              '0x1958035231E125830bA5d17D168cEa07Bb42184a',
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
                hex: '0x0121988f07840e2d14800000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xef470AbC365F88e4582D8027172a392C473A5B53',
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
                hex: '0x106d539ed746fb8000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634',
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
                hex: '0x204fb9313b5d351530a0a478',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a',
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
                hex: '0x1db041d9c4ad0904427b',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47',
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
                hex: '0x09c2007651b2500000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x644A149853E5507AdF3e682218b8AC86cdD62951',
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
                hex: '0x0f1c045b4734e00000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x75aa42c832a8911B77219DbeBABBB40040d16987',
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
                hex: '0x04563918244f400000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x231dED0Dfc99634e52EE1a1329586bc970d773b3',
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
                hex: '0x06f05b5998173600',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c',
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
                hex: '0x204fb9313b5d351530a0a478',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD',
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
                hex: '0x1db041d9c4ad0904427b',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x47793540757c6E6D84155B33cd8D9535CFdb9334',
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
                hex: '0x6c438386683051e4e8200000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xEe543D5de2Dbb5b07675Fc72831A2f1812428393',
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
                hex: '0xddaf351c7e88c48c000000',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0x410286c43a525E1DCC7468a9B091C111C8324cd1',
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
                hex: '0x0de0b59a796c93c0',
              },
              {
                type: 'BigNumber',
                hex: '0x05f5e100',
              },
            ],
            [
              '0x712774CBFFCBD60e9825871CcEFF2F917442b2c3',
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
                hex: '0x204fb9313b5d351530a0a478',
              },
              {
                type: 'BigNumber',
                hex: '0x00',
              },
            ],
            [
              '0xD804F74fe21290d213c46610ab171f7c2EeEBDE7',
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
                hex: '0x1db041d9c4ad0904427b',
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
              '0x170d3b2da05cc2124334240fB34ad1359e34C562',
              '0x3338988d0beb4419Acb8fE624218754053362D06',
              '0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4',
              '0xEF949287834Be010C1A5EDd757c385FB9b644E4A',
              '0x5e68913fbbfb91af30366ab1B21324410b49a308',
              '0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a',
              '0x80CC30811e362aC9aB857C3d7875CbcCc0b65750',
              '0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E',
              '0xb677e080148368EeeE70fA3865d07E92c6500174',
              '0x1958035231E125830bA5d17D168cEa07Bb42184a',
              '0xef470AbC365F88e4582D8027172a392C473A5B53',
              '0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634',
              '0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a',
              '0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47',
              '0x644A149853E5507AdF3e682218b8AC86cdD62951',
              '0x75aa42c832a8911B77219DbeBABBB40040d16987',
              '0x231dED0Dfc99634e52EE1a1329586bc970d773b3',
              '0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c',
              '0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD',
              '0x47793540757c6E6D84155B33cd8D9535CFdb9334',
              '0xEe543D5de2Dbb5b07675Fc72831A2f1812428393',
              '0x410286c43a525E1DCC7468a9B091C111C8324cd1',
              '0x712774CBFFCBD60e9825871CcEFF2F917442b2c3',
              '0xD804F74fe21290d213c46610ab171f7c2EeEBDE7',
            ],
            '0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706',
          ],
          success: true,
        },
      ],
    },
    '0x10b57706AD2345e590c2eA4DC02faef0d9f5b08B': {
      originalContractCallContext: {
        reference: '0x10b57706AD2345e590c2eA4DC02faef0d9f5b08B',
        contractAddress: '0x10b57706AD2345e590c2eA4DC02faef0d9f5b08B',
        abi: contractInfos.isolatedPoolComptroller.abi,
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
          returnValues: ['0xb0269d68CfdCc30Cb7Cd2E0b52b08Fa7Ffd3079b'],
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
    '0x23a73971A6B9f6580c048B9CB188869B2A2aA2aD': {
      originalContractCallContext: {
        reference: '0x23a73971A6B9f6580c048B9CB188869B2A2aA2aD',
        contractAddress: '0x23a73971A6B9f6580c048B9CB188869B2A2aA2aD',
        abi: contractInfos.isolatedPoolComptroller.abi,
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
          returnValues: ['0x2b67Cfaf28a1aBbBf71fb814Ad384d0C5a98e0F9'],
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
    '0x1F4f0989C51f12DAcacD4025018176711f3Bf289': {
      originalContractCallContext: {
        reference: '0x1F4f0989C51f12DAcacD4025018176711f3Bf289',
        contractAddress: '0x1F4f0989C51f12DAcacD4025018176711f3Bf289',
        abi: contractInfos.isolatedPoolComptroller.abi,
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
            '0x5651866bcC4650d6fe5178E5ED7a8Be2cf3F70D0',
            '0x66E213a4b8ba1c8D62cAa4649C7177E29321E262',
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
    '0x596B11acAACF03217287939f88d63b51d3771704': {
      originalContractCallContext: {
        reference: '0x596B11acAACF03217287939f88d63b51d3771704',
        contractAddress: '0x596B11acAACF03217287939f88d63b51d3771704',
        abi: contractInfos.isolatedPoolComptroller.abi,
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
            '0x7df11563c6b6b8027aE619FD9644A647dED5893B',
            '0x72c770A1E73Ad9ccD5249fC5536346f95345Fe2c',
            '0x8Ad2Ad29e4e2C0606644Be51c853A7A4a3078F85',
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
    '0x11537D023f489E4EF0C7157cc729C7B69CbE0c97': {
      originalContractCallContext: {
        reference: '0x11537D023f489E4EF0C7157cc729C7B69CbE0c97',
        contractAddress: '0x11537D023f489E4EF0C7157cc729C7B69CbE0c97',
        abi: contractInfos.isolatedPoolComptroller.abi,
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
            '0x095902273F06eEAC825c3F52dEF44f67a86B31cD',
            '0x9A73Ba89f6a95611B46b68241aBEcAF2cD0bd78A',
            '0x507401883C2a874D919e78a73dD0cB56f2e7eaD7',
            '0x1c50672f4752cc0Ae532D9b93b936C21121Ff08b',
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
  blockNumber: 31693771,
};

export const fakeMulticallResponse1 = {
  results: {
    '0xb0269d68CfdCc30Cb7Cd2E0b52b08Fa7Ffd3079b': {
      originalContractCallContext: {
        reference: '0xb0269d68CfdCc30Cb7Cd2E0b52b08Fa7Ffd3079b',
        contractAddress: '0xb0269d68CfdCc30Cb7Cd2E0b52b08Fa7Ffd3079b',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xe73774DfCD551BF75650772dC2cC56a2B6323453'],
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
              hex: '0x069bc4b712c1e7',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x069bc4b712c1e7',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x170d3b2da05cc2124334240fB34ad1359e34C562'],
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
          methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
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
          methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x3338988d0beb4419Acb8fE624218754053362D06'],
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
          methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
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
          methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x899dDf81DfbbF5889a16D075c352F2b959Dd24A4'],
          success: true,
        },
      ],
    },
    '0x2b67Cfaf28a1aBbBf71fb814Ad384d0C5a98e0F9': {
      originalContractCallContext: {
        reference: '0x2b67Cfaf28a1aBbBf71fb814Ad384d0C5a98e0F9',
        contractAddress: '0x2b67Cfaf28a1aBbBf71fb814Ad384d0C5a98e0F9',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x7FCC76fc1F573d8Eb445c236Cc282246bC562bCE'],
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
          methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
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
          methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xEF949287834Be010C1A5EDd757c385FB9b644E4A'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x3b8531b88f578e',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x3b8531b88f578e',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x5e68913fbbfb91af30366ab1B21324410b49a308'],
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
          methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
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
          methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xb7caC5Ef82cb7f9197ee184779bdc52c5490C02a'],
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
          methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
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
          methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x80CC30811e362aC9aB857C3d7875CbcCc0b65750'],
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
          methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
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
          methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xa109DE0abaeefC521Ec29D89eA42E64F37A6882E'],
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
          methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
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
          methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xb677e080148368EeeE70fA3865d07E92c6500174'],
          success: true,
        },
      ],
    },
    '0x5651866bcC4650d6fe5178E5ED7a8Be2cf3F70D0': {
      originalContractCallContext: {
        reference: '0x5651866bcC4650d6fe5178E5ED7a8Be2cf3F70D0',
        contractAddress: '0x5651866bcC4650d6fe5178E5ED7a8Be2cf3F70D0',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xb22cF15FBc089d470f8e532aeAd2baB76bE87c88'],
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
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
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
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0c7c21bff8e3822cb8',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0c7c21bff8e3822cb8',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
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
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
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
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
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
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
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
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          success: true,
        },
      ],
    },
    '0x66E213a4b8ba1c8D62cAa4649C7177E29321E262': {
      originalContractCallContext: {
        reference: '0x66E213a4b8ba1c8D62cAa4649C7177E29321E262',
        contractAddress: '0x66E213a4b8ba1c8D62cAa4649C7177E29321E262',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
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
              hex: '0x5453ab80175a4e38',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x5453ab80175a4e38',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x1958035231E125830bA5d17D168cEa07Bb42184a'],
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
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
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
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xef470AbC365F88e4582D8027172a392C473A5B53'],
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
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
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
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634'],
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
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
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
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xdeDf3B2bcF25d0023115fd71a0F8221C91C92B1a'],
          success: true,
        },
      ],
    },
    '0x7df11563c6b6b8027aE619FD9644A647dED5893B': {
      originalContractCallContext: {
        reference: '0x7df11563c6b6b8027aE619FD9644A647dED5893B',
        contractAddress: '0x7df11563c6b6b8027aE619FD9644A647dED5893B',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x167F1F9EF531b3576201aa3146b13c57dbEda514'],
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
              hex: '0x183609b83f42',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x183609b83f42',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
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
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
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
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
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
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
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
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
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
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
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
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
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
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
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
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
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
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
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
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
      ],
    },
    '0x72c770A1E73Ad9ccD5249fC5536346f95345Fe2c': {
      originalContractCallContext: {
        reference: '0x72c770A1E73Ad9ccD5249fC5536346f95345Fe2c',
        contractAddress: '0x72c770A1E73Ad9ccD5249fC5536346f95345Fe2c',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x2999C176eBf66ecda3a646E70CeB5FF4d5fCFb8C'],
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
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
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
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
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
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
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
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0435eb6df4bd',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x015e52ea22bd',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
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
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
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
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
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
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
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
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
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
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
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
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
      ],
    },
    '0x8Ad2Ad29e4e2C0606644Be51c853A7A4a3078F85': {
      originalContractCallContext: {
        reference: '0x8Ad2Ad29e4e2C0606644Be51c853A7A4a3078F85',
        contractAddress: '0x8Ad2Ad29e4e2C0606644Be51c853A7A4a3078F85',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xac7D6B77EBD1DB8C5a9f0896e5eB5d485CB677b3'],
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
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
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
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x57a664Dd7f1dE19545fEE9c86C949e3BF43d6D47'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0d287fb79cd097',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0d287fb79cd097',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x644A149853E5507AdF3e682218b8AC86cdD62951'],
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
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
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
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x75aa42c832a8911B77219DbeBABBB40040d16987'],
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
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
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
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x231dED0Dfc99634e52EE1a1329586bc970d773b3'],
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
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
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
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c'],
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
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
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
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD5b20708d8f0FcA52cb609938D0594C4e32E5DaD'],
          success: true,
        },
      ],
    },
    '0x095902273F06eEAC825c3F52dEF44f67a86B31cD': {
      originalContractCallContext: {
        reference: '0x095902273F06eEAC825c3F52dEF44f67a86B31cD',
        contractAddress: '0x095902273F06eEAC825c3F52dEF44f67a86B31cD',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0xE98344A7c691B200EF47c9b8829110087D832C64'],
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
              hex: '0x043a868ae5d8ac576f42',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x043a868ae5d8ac576f42',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
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
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
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
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
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
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
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
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
      ],
    },
    '0x9A73Ba89f6a95611B46b68241aBEcAF2cD0bd78A': {
      originalContractCallContext: {
        reference: '0x9A73Ba89f6a95611B46b68241aBEcAF2cD0bd78A',
        contractAddress: '0x9A73Ba89f6a95611B46b68241aBEcAF2cD0bd78A',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x2E6Af3f3F059F43D764060968658c9F3c8f9479D'],
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
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
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
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x01583d878dcde08084',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x01583d878dcde08084',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
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
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
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
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
      ],
    },
    '0x507401883C2a874D919e78a73dD0cB56f2e7eaD7': {
      originalContractCallContext: {
        reference: '0x507401883C2a874D919e78a73dD0cB56f2e7eaD7',
        contractAddress: '0x507401883C2a874D919e78a73dD0cB56f2e7eaD7',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x7D21841DC10BA1C5797951EFc62fADBBDD06704B'],
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
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
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
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
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
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
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
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xb195',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xb195',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
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
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
      ],
    },
    '0x1c50672f4752cc0Ae532D9b93b936C21121Ff08b': {
      originalContractCallContext: {
        reference: '0x1c50672f4752cc0Ae532D9b93b936C21121Ff08b',
        contractAddress: '0x1c50672f4752cc0Ae532D9b93b936C21121Ff08b',
        abi: contractInfos.rewardsDistributor.abi,
        calls: [
          {
            reference: 'rewardToken',
            methodName: 'rewardToken',
            methodParameters: [],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          },
          {
            reference: 'rewardTokenSupplySpeed',
            methodName: 'rewardTokenSupplySpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowSpeed',
            methodName: 'rewardTokenBorrowSpeeds',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenSupplyState',
            methodName: 'rewardTokenSupplyState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
          {
            reference: 'rewardTokenBorrowState',
            methodName: 'rewardTokenBorrowState',
            methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: ['0x2E2466e22FcbE0732Be385ee2FBb9C59a1098382'],
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
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
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
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x47793540757c6E6D84155B33cd8D9535CFdb9334'],
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
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
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
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xEe543D5de2Dbb5b07675Fc72831A2f1812428393'],
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
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x410286c43a525E1DCC7468a9B091C111C8324cd1'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
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
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0x712774CBFFCBD60e9825871CcEFF2F917442b2c3'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x336632e53c8ed0',
            },
          ],
          decoded: true,
          reference: 'rewardTokenSupplySpeed',
          methodName: 'rewardTokenSupplySpeeds',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x336632e53c8ed0',
            },
          ],
          decoded: true,
          reference: 'rewardTokenBorrowSpeed',
          methodName: 'rewardTokenBorrowSpeeds',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenSupplyState',
          methodName: 'rewardTokenSupplyState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xc097ce7bc90715b34b9f100',
            },
            31465785,
            0,
          ],
          decoded: true,
          reference: 'rewardTokenBorrowState',
          methodName: 'rewardTokenBorrowState',
          methodParameters: ['0xD804F74fe21290d213c46610ab171f7c2EeEBDE7'],
          success: true,
        },
      ],
    },
  },
  blockNumber: 31693771,
};

export const fakeMulticallResponse2 = {
  results: {
    resilientOracle: {
      originalContractCallContext: {
        reference: 'resilientOracle',
        contractAddress: '0x3cD69251D04A28d887Ac14cbe2E14c52F3D57823',
        abi: contractInfos.resilientOracle.abi,
        calls: [
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xe73774DfCD551BF75650772dC2cC56a2B6323453'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x2E2466e22FcbE0732Be385ee2FBb9C59a1098382'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x5B662703775171c4212F2FBAdb7F92e64116c154'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x7FCC76fc1F573d8Eb445c236Cc282246bC562bCE'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x6923189d91fdF62dBAe623a55273F1d20306D9f2'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xe4a90EB942CF2DA7238e8F6cC9EF510c49FC8B4B'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xD60cC803d888A3e743F21D0bdE4bF2cAfdEA1F26'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xb22cF15FBc089d470f8e532aeAd2baB76bE87c88'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x167F1F9EF531b3576201aa3146b13c57dbEda514'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x327d6E6FAC0228070884e913263CFF9eFed4a2C8'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x2999C176eBf66ecda3a646E70CeB5FF4d5fCFb8C'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xE98344A7c691B200EF47c9b8829110087D832C64'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x2E6Af3f3F059F43D764060968658c9F3c8f9479D'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0x7D21841DC10BA1C5797951EFc62fADBBDD06704B'],
          },
          {
            reference: 'getPrice',
            methodName: 'getPrice',
            methodParameters: ['0xac7D6B77EBD1DB8C5a9f0896e5eB5d485CB677b3'],
          },
        ],
      },
      callsReturnContext: [
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0de4df6b80e3cc00',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xe73774DfCD551BF75650772dC2cC56a2B6323453'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0de4df6b80e3cc00',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xe73774DfCD551BF75650772dC2cC56a2B6323453'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0c9fae3b544bf0f7c519800000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0de0b6b3a7640000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x2E2466e22FcbE0732Be385ee2FBb9C59a1098382'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x1849ea7003ce805000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x5B662703775171c4212F2FBAdb7F92e64116c154'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x025202b21243d800',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x7FCC76fc1F573d8Eb445c236Cc282246bC562bCE'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x03b3823ca998c000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x6923189d91fdF62dBAe623a55273F1d20306D9f2'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x6e8f79a1690000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xe4a90EB942CF2DA7238e8F6cC9EF510c49FC8B4B'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0xace51af8c800',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xD60cC803d888A3e743F21D0bdE4bF2cAfdEA1F26'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x15efe0083000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xb22cF15FBc089d470f8e532aeAd2baB76bE87c88'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x1251ff9676d3430000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x167F1F9EF531b3576201aa3146b13c57dbEda514'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x1291249f404fe20800',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x327d6E6FAC0228070884e913263CFF9eFed4a2C8'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x11cce910462f440000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x2999C176eBf66ecda3a646E70CeB5FF4d5fCFb8C'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x0d1b5a9a3ee0a8e800',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x6d6e2edc00',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xE98344A7c691B200EF47c9b8829110087D832C64'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x4d613b2d7000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x2E6Af3f3F059F43D764060968658c9F3c8f9479D'],
          success: true,
        },
        {
          returnValues: [
            {
              type: 'BigNumber',
              hex: '0x01015b3f934d4b256057000000',
            },
          ],
          decoded: true,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0x7D21841DC10BA1C5797951EFc62fADBBDD06704B'],
          success: true,
        },
        {
          returnValues: [],
          decoded: false,
          reference: 'getPrice',
          methodName: 'getPrice',
          methodParameters: ['0xac7D6B77EBD1DB8C5a9f0896e5eB5d485CB677b3'],
          success: false,
        },
      ],
    },
  },
  blockNumber: 31688260,
};

export const fakeIsolatedPoolParticipantsCount: Awaited<
  ReturnType<typeof getIsolatedPoolParticipantsCount>
> = {
  pools: fakePoolLensContractResponses.getAllPools.map(pool => ({
    __typename: 'Pool',
    id: pool.comptroller,
    markets: pool.vTokens.map(({ vToken }) => ({
      id: vToken,
      supplierCount: 10,
      borrowerCount: 20,
    })),
  })),
};
