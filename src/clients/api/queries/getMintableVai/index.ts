import { GetMintableVaiInput, GetMintableVaiOutput } from './types';
import formatToOutput from './formatToOutput';

export * from './types';

const getMintableVai = async ({
  vaiControllerContract,
  accountAddress,
}: GetMintableVaiInput): Promise<GetMintableVaiOutput> => {
  const res = await vaiControllerContract.methods.getMintableVAI(accountAddress).call();

  return formatToOutput(res);
};

export default getMintableVai;
