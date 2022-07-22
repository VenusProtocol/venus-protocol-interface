import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';

import { GetVrtVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  totalPrincipalAmount,
}: Awaited<
  ReturnType<ReturnType<VrtVault['methods']['userInfo']>['call']>
>): GetVrtVaultUserInfoOutput => ({
  stakedVrtWei: new BigNumber(totalPrincipalAmount),
});

export default formatToUserInfo;
