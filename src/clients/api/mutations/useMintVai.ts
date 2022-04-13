import { MutationObserverOptions, useMutation } from 'react-query';

import { mintVai, IMintVaiInput, MintVaiOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitrollerContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  MintVaiOutput,
  Error,
  Omit<IMintVaiInput, 'vaiControllerContract'>
>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useVaiUnitrollerContract();

  // @TODO: invalidate queries related to fetching the user minted VAI amount on success
  return useMutation(
    FunctionKey.MINT_VAI,
    (params: Omit<IMintVaiInput, 'vaiControllerContract'>) =>
      mintVai({
        vaiControllerContract,
        ...params,
      }),
    options,
  );
};

export default useMintVai;
