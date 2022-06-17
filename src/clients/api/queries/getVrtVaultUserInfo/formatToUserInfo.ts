import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';
import { IGetVrtVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  totalPrincipalAmount,
}: Awaited<
  ReturnType<ReturnType<VrtVault['methods']['userInfo']>['call']>
>): IGetVrtVaultUserInfoOutput => ({
  stakedVrtWei: new BigNumber(totalPrincipalAmount),
});

export default formatToUserInfo;
