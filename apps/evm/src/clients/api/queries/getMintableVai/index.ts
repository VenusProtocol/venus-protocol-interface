import formatToOutput from './formatToOutput';
import { GetMintableVaiInput, GetMintableVaiOutput } from './types';

export * from './types';

const getMintableVai = async ({
  vaiControllerContract,
  vaiContract,
  accountAddress,
}: GetMintableVaiInput): Promise<GetMintableVaiOutput> => {
  const [vaiTotalSupplyResponse, mintCapResponse, accountMintableVaiResponse] = await Promise.all([
    vaiContract.totalSupply(),
    vaiControllerContract.mintCap(),
    vaiControllerContract.getMintableVAI(accountAddress),
  ]);

  return formatToOutput({
    mintCapResponse,
    accountMintableVaiResponse,
    vaiTotalSupplyResponse,
  });
};

export default getMintableVai;
