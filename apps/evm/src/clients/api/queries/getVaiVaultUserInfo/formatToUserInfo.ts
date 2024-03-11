import BigNumber from 'bignumber.js';

import type { VaiVault } from 'libs/contracts';

import type { GetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<ReturnType<VaiVault['userInfo']>>): GetVaiVaultUserInfoOutput => ({
  stakedVaiMantissa: new BigNumber(amount.toString()),
});

export default formatToUserInfo;
