import BigNumber from 'bignumber.js';

import type { Vai, VaiController } from 'libs/contracts';

import type { GetMintableVaiOutput } from './types';

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
  const vaiLiquidityMantissa = mintCapMantissa.minus(vaiTotalSupplyMantissa);
  const accountMintableVaiMantissa = new BigNumber(accountMintableVaiResponse[1].toString());

  return {
    vaiLiquidityMantissa,
    accountMintableVaiMantissa,
  };
};

export default formatToOutput;
