import type { TransactionReceipt } from 'web3-core/types';

import { Comptroller } from 'types/contracts';

export interface IClaimVenusInput {
  comptrollerContract: Comptroller;
  fromAccountAddress: string;
  tokenAddresses: string[];
}

export type ClaimVenusOutput = TransactionReceipt;

const claimVenus = async ({
  comptrollerContract,
  fromAccountAddress,
  tokenAddresses,
}: IClaimVenusInput): Promise<ClaimVenusOutput> =>
  comptrollerContract.methods['claimVenus(address,address[])'](
    fromAccountAddress,
    tokenAddresses,
  ).send({
    from: fromAccountAddress,
  });

export default claimVenus;
