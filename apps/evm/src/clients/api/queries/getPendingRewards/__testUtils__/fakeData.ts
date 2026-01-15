import BigNumber from 'bignumber.js';
import type { poolLensAbi, primeAbi, venusLensAbi } from 'libs/contracts';
import { ChainId, type MerklDistribution } from 'types';
import type {
  Address,
  ContractFunctionArgs,
  ReadContractReturnType,
  SimulateContractReturnType,
} from 'viem';
import type { GetMerklUserRewardsResponse } from '../getMerklUserRewards';

export const fakeGetPriceOutput = 3517811033439631360n;

export const fakeGetPendingXvsOutput = 1000000000000000000n;

export const fakeGetVaultPaused = false;

export const fakeGetIsolatedPoolPendingRewardsOutput: ReadContractReturnType<
  typeof poolLensAbi,
  'getPendingRewards',
  ContractFunctionArgs<typeof poolLensAbi, 'pure' | 'view', 'getPendingRewards'>
> = [
  {
    distributorAddress: '0xb0269d68CfdCc30Cb7Cd2E0b52b08Fa7Ffd3079b',
    rewardTokenAddress: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    pendingRewards: [
      {
        vTokenAddress: '0x170d3b2da05cc2124334240fB34ad1359e34C562',
        amount: 0n,
      },
    ],
    totalRewards: 0n,
  },
  {
    distributorAddress: '0x2aBEf3602B688493fe698EF11D27DCa43a0CE4BE',
    rewardTokenAddress: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
    pendingRewards: [
      {
        vTokenAddress: '0x170d3b2da05cc2124334240fB34ad1359e34C562',
        amount: 100000n,
      },
      {
        vTokenAddress: '0x3338988d0beb4419Acb8fE624218754053362D06',
        amount: 10000n,
      },
    ],
    totalRewards: 0n,
  },
];

export const fakeGetLegacyPoolPendingRewardsOutput: ReadContractReturnType<
  typeof venusLensAbi,
  'pendingRewards',
  ContractFunctionArgs<typeof venusLensAbi, 'pure' | 'view', 'pendingRewards'>
> = {
  distributorAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
  rewardTokenAddress: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
  pendingRewards: [
    {
      vTokenAddress: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
      amount: 13463630382n,
    },
    {
      vTokenAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      amount: 17258246849676376539136n,
    },
  ],
  totalRewards: 2275794339252092534784n,
};

export const fakeGetXvsVaultPoolInfosOutput = [
  '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
  100n, // allocPoint
  500000000000000n, // accRewardPerShare
  33333334n, // lastRewardBlock
  300n, // lockPeriod
] as const;

export const fakeGetXvsVaultPendingRewardOutput = 645201192824999936n;

export const fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput = 0n;

export const fakeGetPrimePendingRewardsOutput: SimulateContractReturnType<
  typeof primeAbi,
  'getPendingRewards',
  ContractFunctionArgs<typeof primeAbi, 'nonpayable' | 'payable', 'getPendingRewards'>
>['result'] = [
  {
    amount: 13463630382n,
    rewardToken: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
    vToken: '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
  },
  {
    amount: 17258246849676376539136n,
    rewardToken: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    vToken: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
  },
];

export const fakeMerklCampaigns: Record<Address, MerklDistribution[]> = {
  '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7': [
    {
      type: 'merkl' as const,
      token: {
        chainId: ChainId.BSC_TESTNET,
        address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
        decimals: 18,
        symbol: 'XVS',
        iconSrc: '/src/libs/tokens/img/underlyingTokens/xvs.svg',
      },
      apyPercentage: new BigNumber('4.948661868555404'),
      dailyDistributedTokens: new BigNumber('24879.397857142857142752'),
      rewardDetails: {
        tags: ['zksync'],
        appName: 'Ignite',
        claimUrl: 'https://app.zksyncignite.xyz/',
        description: 'Ignite campaign',
        merklCampaignIdentifier:
          '0x05b2a61240d8e71f2507bb72f9f3a8209ac8ba50ed44ab77ef981602613ebde6',
        marketAddress: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
      },
      isActive: false,
    },
  ],
  '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A': [
    {
      type: 'merkl' as const,
      token: {
        chainId: ChainId.BSC_TESTNET,
        address: '0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e',
        decimals: 18,
        symbol: 'ZK',
        iconSrc: '/src/libs/tokens/img/underlyingTokens/zk.svg',
      },
      apyPercentage: new BigNumber('4.918338308869741'),
      dailyDistributedTokens: new BigNumber('21301.973571428571428352'),
      rewardDetails: {
        tags: ['zksync'],
        appName: 'Ignite',
        claimUrl: 'https://app.zksyncignite.xyz/',
        description: 'Ignite campaign',
        merklCampaignIdentifier:
          '0xa7e87a020413bc49e0db7b65f8806c86af035888f447d9fa030d2be17c8d50c6',
        marketAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      },
      isActive: true,
    },
  ],
};

export const fakeMerklRewardsResponse: GetMerklUserRewardsResponse[number] = {
  rewards: [
    {
      root: '0xf53954b8200a10d4fcc7ec978037be383a58146463c2bb80555bd9c8f4ffab78',
      recipient: '0xFd7dA20ea0bE63ACb0852f97E950376E7E4a817D',
      amount: '1076268856872481933',
      token: {
        address: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
        chainId: 324,
        symbol: 'ZK',
        decimals: 18,
      },
      breakdowns: [
        {
          tokenAddress: '0x1',
          reason: 'ERC20_0x1Fa916C27c7C2c4602124A14C77Dbb40a5FF1BE8',
          amount: '148724354119319218',
          claimed: '0',
          pending: '87476171975286',
          campaignId: '0xa87004bef5a42a24de9dd6bee569cc6bfcf7048bde3495a5078712fd3097e218',
        },
        {
          tokenAddress: '0x2',
          reason: 'ERC20_0x697a70779C1A03Ba2BD28b7627a902BFf831b616',
          amount: '76658101233016960',
          claimed: '0',
          pending: '0',
          campaignId: '0x05b2a61240d8e71f2507bb72f9f3a8209ac8ba50ed44ab77ef981602613ebde6',
        },
      ],
    },
  ],
};
