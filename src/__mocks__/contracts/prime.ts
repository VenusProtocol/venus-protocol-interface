import { BigNumber as BN } from 'ethers';
import { Prime } from 'packages/contracts';

const primeResponses: {
  MINIMUM_STAKED_XVS: Awaited<ReturnType<Prime['MINIMUM_STAKED_XVS']>>;
  getAllMarkets: Awaited<ReturnType<Prime['getAllMarkets']>>;
  calculateAPR: Awaited<ReturnType<Prime['calculateAPR']>>;
  estimateAPR: Awaited<ReturnType<Prime['estimateAPR']>>;
} = {
  MINIMUM_STAKED_XVS: BN.from('1000000000000000000000'),
  getAllMarkets: [
    '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
    '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
    '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    '0x74469281310195A04840Daf6EdF576F559a3dE80',
  ] as Awaited<ReturnType<Prime['getAllMarkets']>>,
  calculateAPR: {
    borrowAPR: BN.from('32'),
    supplyAPR: BN.from('29'),
  } as Awaited<ReturnType<Prime['calculateAPR']>>,
  estimateAPR: {
    borrowAPR: BN.from('20'),
    supplyAPR: BN.from('23'),
  } as Awaited<ReturnType<Prime['estimateAPR']>>,
};

export default primeResponses;
