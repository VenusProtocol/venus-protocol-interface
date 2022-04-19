import { MutationObserverOptions, useMutation } from 'react-query';

import { claimVenus, IClaimVenusInput, ClaimVenusOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  ClaimVenusOutput,
  Error,
  Omit<IClaimVenusInput, 'vaiControllerContract'>
>;

const useClaimVenus = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  // @TODO: invalidate queries related to fetching the user claimable XVS
  // balance
  return useMutation(
    FunctionKey.CLAIM_VENUS,
    (params: Omit<IClaimVenusInput, 'comptrollerContract'>) =>
      claimVenus({
        comptrollerContract,
        ...params,
      }),
    options,
  );
};

export default useClaimVenus;
