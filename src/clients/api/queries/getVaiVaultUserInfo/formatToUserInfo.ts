import BigNumber from 'bignumber.js';

import { VaiVault } from 'types/contracts';

import { GetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<
  ReturnType<ReturnType<VaiVault['methods']['userInfo']>['call']>
>): GetVaiVaultUserInfoOutput => ({
  stakedVaiWei: new BigNumber(amount),
});

export default formatToUserInfo;
