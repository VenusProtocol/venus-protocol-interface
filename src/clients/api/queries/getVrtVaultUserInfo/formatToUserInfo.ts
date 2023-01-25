import BigNumber from 'bignumber.js';

import { VrtVault } from 'types/contracts';

import { GetVrtVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  totalPrincipalAmount,
}: Awaited<ReturnType<VrtVault['userInfo']>>): GetVrtVaultUserInfoOutput => ({
  stakedVrtWei: new BigNumber(totalPrincipalAmount.toString()),
});

export default formatToUserInfo;
