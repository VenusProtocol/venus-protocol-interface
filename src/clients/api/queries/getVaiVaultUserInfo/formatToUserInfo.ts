import BigNumber from 'bignumber.js';

import { VaiVault } from 'types/contracts';
import { IGetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<
  ReturnType<ReturnType<VaiVault['methods']['userInfo']>['call']>
>): IGetVaiVaultUserInfoOutput => ({
  stakedVaiWei: new BigNumber(amount),
});

export default formatToUserInfo;
