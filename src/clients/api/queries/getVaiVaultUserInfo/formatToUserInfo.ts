import BigNumber from 'bignumber.js';
import { VaiVault } from 'packages/contracts';

import { GetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<ReturnType<VaiVault['userInfo']>>): GetVaiVaultUserInfoOutput => ({
  stakedVaiWei: new BigNumber(amount.toString()),
});

export default formatToUserInfo;
