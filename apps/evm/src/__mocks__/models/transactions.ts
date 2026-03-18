import BigNumber from 'bignumber.js';
import { usdt } from './tokens';
import { vUsdtCorePool } from './vTokens';

export const transactions = {
  transactions: [
    {
      accountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      amounts: [
        {
          amountCents: 2406931.018168455,
          amountTokens: new BigNumber('24066181578079398.612862'),
          token: usdt,
        },
      ],
      blockNumber: '41604850',
      blockTimestamp: new Date('2024-08-23T04:17:09.000Z'),
      chainId: 97,
      contractAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      hash: '0xda13a0f45b10dabd21b863b6b602c6d8776edd4c6b10fe65a0881d491f468f35',
      poolName: 'Metaverse',
      vToken: vUsdtCorePool,
      txType: 'withdraw',
    },
    {
      accountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      amounts: [
        {
          amountCents: 2401121.5761324344,
          amountTokens: new BigNumber('24001813290985731.455439'),
          token: usdt,
        },
      ],
      blockNumber: '41114054',
      blockTimestamp: new Date('2024-08-06T02:18:03.000Z'),
      chainId: 97,
      contractAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      hash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
      poolName: 'Metaverse',
      vToken: vUsdtCorePool,
      txType: 'supply',
    },
    {
      accountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      amounts: [
        {
          amountCents: 2401121.5761324344,
          amountTokens: new BigNumber('24001813290985731.455439'),
          token: usdt,
        },
      ],
      blockNumber: '41114053',
      blockTimestamp: new Date('2024-08-05T02:18:03.000Z'),
      chainId: 97,
      contractAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      hash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
      poolName: 'Metaverse',
      vToken: vUsdtCorePool,
      txType: 'borrow',
    },
    {
      accountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      amounts: [
        {
          amountCents: 2401121.5761324344,
          amountTokens: new BigNumber('24001813290985731.455439'),
          token: usdt,
        },
      ],
      blockNumber: '41114052',
      blockTimestamp: new Date('2024-08-04T02:18:03.000Z'),
      chainId: 97,
      contractAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      hash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
      poolName: 'Metaverse',
      vToken: vUsdtCorePool,
      txType: 'repay',
    },
    {
      accountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      blockNumber: '41114051',
      blockTimestamp: new Date('2024-08-03T02:18:03.000Z'),
      chainId: 97,
      contractAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      hash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
      poolName: 'Metaverse',
      vToken: vUsdtCorePool,
      txType: 'enterMarket',
    },
    {
      accountAddress: '0x3d759121234cd36F8124C21aFe1c6852d2bEd848',
      blockNumber: '41114050',
      blockTimestamp: new Date('2024-08-03T02:18:00.000Z'),
      chainId: 97,
      contractAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      hash: '0xb0435b135762a7ca2ad7dccb9aa6c7f50237c6139b16a76348d6c64dfece110e',
      poolName: 'Metaverse',
      vToken: vUsdtCorePool,
      txType: 'exitMarket',
    },
  ],
  count: 7,
};
