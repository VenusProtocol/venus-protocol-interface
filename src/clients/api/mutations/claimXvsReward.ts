import BigNumber from 'bignumber.js';
import type { TransactionReceipt } from 'web3-core/types';

import { VBEP_TOKENS } from 'constants/tokens';
import { Comptroller, VenusLens } from 'types/contracts';
import getVTokenBalancesAll from '../queries/getVTokenBalancesAll';

export interface IClaimXvsRewardInput {
  comptrollerContract: Comptroller;
  venusLensContract: VenusLens;
  fromAccountAddress: string;
}

export type ClaimXvsRewardOutput = TransactionReceipt;

const claimXvsReward = async ({
  comptrollerContract,
  venusLensContract,
  fromAccountAddress,
}: IClaimXvsRewardInput): Promise<ClaimXvsRewardOutput> => {
  // Fetch list of tokens for which user have a positive balance, since these
  // are the tokens susceptible to have generated XVS rewards
  const vTokenAddresses = Object.values(VBEP_TOKENS).map(vToken => vToken.address);

  const vTokenBalances = await getVTokenBalancesAll({
    venusLensContract,
    vtAddresses: vTokenAddresses,
    account: fromAccountAddress,
  });

  const filteredVTokenAddresses = vTokenBalances
    .filter(
      vTokenBalance =>
        new BigNumber(vTokenBalance.borrowBalanceCurrent).isGreaterThan(0) ||
        new BigNumber(vTokenBalance.balanceOfUnderlying).isGreaterThan(0),
    )
    .map(vTokenBalance => vTokenBalance.vToken);

  // Send query to claim XVS reward
  return comptrollerContract.methods['claimVenus(address,address[])'](
    fromAccountAddress,
    filteredVTokenAddresses,
  ).send({
    from: fromAccountAddress,
  });
};

export default claimXvsReward;
