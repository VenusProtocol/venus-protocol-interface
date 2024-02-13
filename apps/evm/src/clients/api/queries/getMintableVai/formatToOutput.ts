import BigNumber from 'bignumber.js';
import { Vai, VaiController } from 'libs/contracts';

import { GetMintableVaiOutput } from './types';

interface FormatMintableVaiInput {
  mintCapResponse: Awaited<ReturnType<VaiController['mintCap']>>;
  vaiTotalSupplyResponse: Awaited<ReturnType<Vai['totalSupply']>>;
  accountMintableVaiResponse: Awaited<ReturnType<VaiController['getMintableVAI']>>;
}

const formatToOutput = ({
  mintCapResponse,
  vaiTotalSupplyResponse,
  accountMintableVaiResponse,
}: FormatMintableVaiInput): GetMintableVaiOutput => {
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
  };
};

export default formatToOutput;
