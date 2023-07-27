import { Transaction } from 'types';

import vTokens, { vUsdt } from '__mocks__/models/vTokens';
import formatTransaction from 'clients/api/queries/getTransactions/formatTransaction';
import { TransactionResponse } from 'clients/api/queries/getTransactions/types';
import { TOKENS } from 'constants/tokens';

export const transactionResponse: TransactionResponse[] = [
  {
    amountMantissa: '0',
    blockNumber: 19636734,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    timestamp: 1677583364669,
    to: '0xD4aDbd5ed497c7720127Bfe9b05D725aC72ae2a9',
    transactionHash: '0x6b8f0ebd99034cf5bec250a2e14b1d594e85be39a2cecd1193536e9576897800',
    logIndex: 1,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '499999979046',
    blockNumber: 19636720,
    category: 'vtoken',
    event: 'Transfer',
    from: '0xD4aDbd5ed497c7720127Bfe9b05D725aC72ae2a9',
    timestamp: 1677583364669,
    to: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    transactionHash: '0xb1739f27bf65398459df3228c0c74d955e8438e831fbde17506490368b264bf4',
    logIndex: 2,
    tokenAddress: TOKENS.busd.address,
  },
  {
    amountMantissa: '5000000000000000000000',
    blockNumber: 19632326,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
    timestamp: 1677583364669,
    to: '0x8eE02B3FeCcae787992c4790bc31b350E7d1F382',
    transactionHash: '0x883ef64e9c1b043325834e1a9109bb5a31af4af67cac0b8c9d82b777c0c6efb7',
    logIndex: 3,
    tokenAddress: vUsdt.address,
  },
  {
    amountMantissa: '39000000000000000000',
    blockNumber: 19625976,
    category: 'vtoken',
    event: 'Mint',
    from: '0x7D011896EAF0D59a4Da7CD9573F4F15AB5123Ab2',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x40bcf58c72dcf0f56cf349155178de5d5b34b1cc36a00ee3c52789538acbfa23',
    logIndex: 4,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '3332250000000000000000000',
    blockNumber: 19614816,
    category: 'vtoken',
    event: 'Redeem',
    from: '0xa60dF6af57fb55c62511cA96eD6dA0AfE977436b',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x389d646c3b3516eb905a571e327b4a368757f9c24963efe88e9c3cb6bacd89c4',
    logIndex: 5,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '15495139729223118',
    blockNumber: 19614805,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
    timestamp: 1677583364669,
    to: '0xa60dF6af57fb55c62511cA96eD6dA0AfE977436b',
    transactionHash: '0xc2fff9b3781c39d727773f8233e72a45af3d49fa967057a7f1c7724ef244882e',
    logIndex: 6,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '1000000000000000000',
    blockNumber: 19614713,
    category: 'vtoken',
    event: 'Redeem',
    from: '0xa60dF6af57fb55c62511cA96eD6dA0AfE977436b',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0xebc9e9d632f30fe45b7181801eb7c03e60b275c207c7d8ebb5e317a1becf9f5b',
    logIndex: 7,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '8000000000000000000000',
    blockNumber: 19614700,
    category: 'vtoken',
    event: 'Mint',
    from: '0xa60dF6af57fb55c62511cA96eD6dA0AfE977436b',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x862bdfa3b617562c5729b258728d2e504856c6f267bbba80fc432c3a8afe29fd',
    logIndex: 8,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '39365649572954',
    blockNumber: 19612497,
    category: 'vtoken',
    event: 'Mint',
    from: '0x8eE02B3FeCcae787992c4790bc31b350E7d1F382',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x85dca6ce86ae0e68b7a6486c72109322781fc4fdfd87bfccd59be258b7e7d8a1',
    logIndex: 9,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '2036811601414153',
    blockNumber: 19606971,
    category: 'vtoken',
    event: 'Borrow',
    from: '0xB4A5A75A3cA76CF0939EF4A1fFb5DF3432F80e96',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x496c5be16dcd2c1127f45879e0e571bb63b31cf197cbf069cf81cadf23686cfc',
    logIndex: 10,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '2000000000000000000000',
    blockNumber: 19606940,
    category: 'vtoken',
    event: 'Mint',
    from: '0xB4A5A75A3cA76CF0939EF4A1fFb5DF3432F80e96',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x4eeeab99581780110930b584faa5a2290c6dd989da23d67142da94aef6e2567c',
    logIndex: 11,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '1255762298411977',
    blockNumber: 19605600,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    timestamp: 1677583364669,
    to: '0x7b702744A7F9042670FD3d294eD81C82bA6A0350',
    transactionHash: '0x000e045d8120d6de9a36e0d24bfcff2a52f8dbb2612e507fbe1d89d772a4f335',
    logIndex: 12,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '63969210214200',
    blockNumber: 19605119,
    category: 'vtoken',
    event: 'Mint',
    from: '0x1A310A642C1B9Ace2e61ACbA9408DcFD27100E46',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x65f3e3923876aca08d4a4b6ad2e0a985f049732ede665faacf0490b04d35144d',
    logIndex: 13,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '68256811',
    blockNumber: 19589102,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x2D7A3Ae4FC2aaF3852244032F6aCFd2C1b953c5B',
    timestamp: 1677583364669,
    to: '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
    transactionHash: '0x406ed11513e989a8532130c88a776416d91166aede02d152500af64700f63a76',
    logIndex: 14,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '148302657892509813122',
    blockNumber: 19589089,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x1bD8Aa256b500f260855DE5A307b735aeF25f96a',
    timestamp: 1677583364669,
    to: '0x488aB2826a154da01CC4CC16A8C83d4720D3cA2C',
    transactionHash: '0xbd3324f298e8064e7cd6e4d53b322ea5778a79003abb25e010340857ac2ef5e2',
    logIndex: 15,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '68426113815486080',
    blockNumber: 19589043,
    category: 'vtoken',
    event: 'Mint',
    from: '0xdD8C11CEedB110eC42b467D5861252dA9130Bf6C',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x85df57add40993d57b11b203743ffb3ec7b615c684c79754c84217e645898717',
    logIndex: 16,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '800000000000000000',
    blockNumber: 19588967,
    category: 'vtoken',
    event: 'Transfer',
    from: '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
    timestamp: 1677583364669,
    to: '0xdD8C11CEedB110eC42b467D5861252dA9130Bf6C',
    transactionHash: '0x102add48b0ce2de31d39b45d4e1bb8f55eb45c884146607487d09857b1b0bf7b',
    logIndex: 17,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '277449960',
    blockNumber: 19588945,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
    timestamp: 1677583364669,
    to: '0xdD8C11CEedB110eC42b467D5861252dA9130Bf6C',
    transactionHash: '0x839f73ce52cd04472dcea7e7b6670d3027ebd309e9bd7170345965d96ffed914',
    logIndex: 18,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '159200000000000000000',
    blockNumber: 19588667,
    category: 'vtoken',
    event: 'Redeem',
    from: '0x6DffAF09502CD4a9DfcB09436593D13aeC921ffD',
    timestamp: 1677583364669,
    to: '',
    transactionHash: '0x716d01587f26bbe313dab9858756f32c79efd5b0d33609e8ad7a294dfa7a6d31',
    logIndex: 19,
    tokenAddress: TOKENS.xvs.address,
  },
  {
    amountMantissa: '3936585693',
    blockNumber: 19588665,
    category: 'vtoken',
    event: 'Transfer',
    from: '0x8485F50a695262C84f06679Ea9Ea697Aae7227dE',
    timestamp: 1677583364669,
    to: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    transactionHash: '0x51cea410036b49398541f309c855acd8ec51f3ea802a61a85edd0af67944767d',
    logIndex: 20,
    tokenAddress: TOKENS.xvs.address,
  },
];

const transactions = transactionResponse.reduce((acc, data) => {
  const transaction = formatTransaction({ data, vTokens });
  return transaction ? [...acc, transaction] : acc;
}, [] as Transaction[]);

export default transactions;
