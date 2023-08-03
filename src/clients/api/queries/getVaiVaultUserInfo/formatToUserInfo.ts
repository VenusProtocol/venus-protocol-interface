import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { GetVaiVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
}: Awaited<ReturnType<ContractTypeByName<'vaiVault'>['userInfo']>>): GetVaiVaultUserInfoOutput => ({
  stakedVaiWei: new BigNumber(amount.toString()),
});

export default formatToUserInfo;
