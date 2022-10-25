import { Token } from 'types';

// TODO: move to global file/merge with tokens (?) (see https://jira.toolsfdg.net/browse/VEN-712)

// TODO: handle mainnet (check PancakeSwap's repository to get list of tokens
// available on mainnet)
const PANCAKE_SWAP_TOKENS = {
  cake: {
    id: 'cake',
    symbol: 'CAKE',
    decimals: 18,
    address: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
    asset:
      'https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg',
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'BUSD',
    decimals: 18,
    address: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
    asset:
      'https://pancakeswap.finance/images/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.svg',
  } as Token,
  wbnb: {
    id: 'wbnb',
    symbol: 'WBNB',
    decimals: 18,
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    asset:
      'https://pancakeswap.finance/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.svg',
  } as Token,
  // TODO: add other tokens (BNB for example)
};

const tokenList = { ...PANCAKE_SWAP_TOKENS, ...TOKENS };

export default tokenList;
