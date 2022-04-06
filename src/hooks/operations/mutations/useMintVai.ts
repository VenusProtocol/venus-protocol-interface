import { MutationObserverOptions, useMutation } from 'react-query';

import mintVai, { IMintVaiInput, IMintVaiOutput } from 'clients/api/mutations/mintVai';
import FunctionKey from 'constants/functionKey';
import { useVaiUnitroller } from 'hooks/useContract';

type Options = MutationObserverOptions<
  IMintVaiOutput,
  Error,
  Omit<IMintVaiInput, 'vaiControllerContract'>
>;

const useMintVai = (options?: Options) => {
  const vaiControllerContract = useVaiUnitroller();

  return useMutation(
    [FunctionKey.MINT_VAI, options?.variables],
    (params: Omit<IMintVaiInput, 'vaiControllerContract'>) =>
      mintVai({
        vaiControllerContract,
        ...params,
      }),
    options,
  );
};

export default useMintVai;
