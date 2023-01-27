import BigNumber from 'bignumber.js';

import { VaiVault } from 'types/contracts';

import { GetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<ReturnType<VaiVault['userInfo']>>): GetVaiVaultUserInfoOutput => ({
  stakedVaiWei: new BigNumber(amount.toString()),
});

export default formatToUserInfo;
