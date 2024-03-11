import { BigNumber as BN } from 'ethers';

import type { Prime } from 'libs/contracts';

const primeResponses: {
  MINIMUM_STAKED_XVS: Awaited<ReturnType<Prime['MINIMUM_STAKED_XVS']>>;
  getAllMarkets: Awaited<ReturnType<Prime['getAllMarkets']>>;
  calculateAPR: Awaited<ReturnType<Prime['calculateAPR']>>;
  estimateAPR: Awaited<ReturnType<Prime['estimateAPR']>>;
  tokens: Awaited<ReturnType<Prime['tokens']>>;
} = {
  MINIMUM_STAKED_XVS: BN.from('1000000000000000000000'),
  getAllMarkets: [
    '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
    '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
    '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    '0x74469281310195A04840Daf6EdF576F559a3dE80',
    '0x3338988d0beb4419Acb8fE624218754053362D06',
    '0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c',
    '0x712774CBFFCBD60e9825871CcEFF2F917442b2c3',
  ] as Awaited<ReturnType<Prime['getAllMarkets']>>,
  calculateAPR: {
    borrowAPR: BN.from('32'),
    supplyAPR: BN.from('29'),
  } as Awaited<ReturnType<Prime['calculateAPR']>>,
  estimateAPR: {
    borrowAPR: BN.from('20'),
    supplyAPR: BN.from('23'),
  } as Awaited<ReturnType<Prime['estimateAPR']>>,
  tokens: {
    exists: true,
    isIrrevocable: false,
  } as Awaited<ReturnType<Prime['tokens']>>,
};

export default primeResponses;
