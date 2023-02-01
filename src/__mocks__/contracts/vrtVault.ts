import { BigNumber as BN } from 'ethers';

import { VrtVault } from 'types/contracts';

const vrtVaultResponses: {
  userInfo: Awaited<ReturnType<VrtVault['userInfo']>>;
  getAccruedInterest: Awaited<ReturnType<VrtVault['getAccruedInterest']>>;
  interestRatePerBlock: Awaited<ReturnType<VrtVault['interestRatePerBlock']>>;
} = {
  userInfo: {
    userAddress: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    accrualStartBlockNumber: BN.from('12321421321'),
    totalPrincipalAmount: BN.from('100000000000000'),
    lastWithdrawnBlockNumber: BN.from('123124213123'),
  } as Awaited<ReturnType<VrtVault['userInfo']>>,
  getAccruedInterest: BN.from('800000000000000'),
  interestRatePerBlock: BN.from('9000000000000'),
};

export default vrtVaultResponses;
