import { MutationObserverOptions, useMutation } from 'react-query';

import { mintVai, MintVaiInput, MintVaiOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitroller } from 'hooks/useContract';

type Options = MutationObserverOptions<
  MintVaiOutput,
  Error,
  Omit<MintVaiInput, 'vaiControllerContract'>
>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useVaiUnitroller();

  return useMutation(
    [FunctionKey.MINT_VAI, options?.variables],
    (params: Omit<MintVaiInput, 'vaiControllerContract'>) =>
      mintVai({
        vaiControllerContract,
        ...params,
      }),
    options,
  );
};

export default useMintVai;
