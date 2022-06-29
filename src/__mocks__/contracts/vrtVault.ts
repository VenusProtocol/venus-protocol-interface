import { VrtVault } from 'types/contracts';

const vrtVaultResponses: {
  userInfo: Awaited<ReturnType<ReturnType<VrtVault['methods']['userInfo']>['call']>>;
  getAccruedInterest: Awaited<
    ReturnType<ReturnType<VrtVault['methods']['getAccruedInterest']>['call']>
  >;
  interestRatePerBlock: Awaited<
    ReturnType<ReturnType<VrtVault['methods']['interestRatePerBlock']>['call']>
  >;
} = {
  userInfo: {
    userAddress: '0x47bead2563dcbf3bf2c9407fea4dc236faba485a',
    accrualStartBlockNumber: '12321421321',
    totalPrincipalAmount: '100000000000000',
    lastWithdrawnBlockNumber: '123124213123',
    0: '100000000000000',
    1: '12321421321',
    2: '100000000000000',
    3: '123124213123',
  },
  getAccruedInterest: '800000000000000',
  interestRatePerBlock: '9000000000000',
};

export default vrtVaultResponses;
