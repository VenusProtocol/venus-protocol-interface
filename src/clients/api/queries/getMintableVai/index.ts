import BigNumber from 'bignumber.js';
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

  const mintCapMantissa = new BigNumber(mintCapResponse.toString());
  const vaiTotalSupplyMantissa = new BigNumber(vaiTotalSupplyResponse.toString());
  const accountMintableVaiMantissa = new BigNumber(accountMintableVaiResponse[1].toString());

  const remainingMintableVaiMantissa = mintCapMantissa.minus(vaiTotalSupplyMantissa);
  // if there is no more VAI available to be minted globally, return 0
  if (remainingMintableVaiMantissa.lte(0)) {
    return {
      mintableVaiMantissa: new BigNumber(0),
    };
  }

  // if there is VAI available, return either the user's limit or up to what is available globally
  const mintableVaiMantissa = remainingMintableVaiMantissa.gte(accountMintableVaiMantissa)
    ? accountMintableVaiMantissa
    : remainingMintableVaiMantissa;

  return {
    mintableVaiMantissa,
  };;
};

export default getMintableVai;
