import BigNumber from 'bignumber.js';
import { VaiVault } from 'packages/contracts';

import { GetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<ReturnType<VaiVault['userInfo']>>): GetVaiVaultUserInfoOutput => ({
  stakedVaiMantissa: new BigNumber(amount.toString()),
});

export default formatToUserInfo;
