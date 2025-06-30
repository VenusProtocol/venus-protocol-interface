import { ChainId } from '@venusprotocol/chains';
import { VError } from 'libs/errors';
import { restService } from 'utilities';
import type { Address, PublicClient } from 'viem';

const WBNB_BURN_CONVERTER_CONTRACT_ADDRESS = '0x9ef79830e626c8cca7e46dced1f90e51e7cfcebe';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000001';

interface DestinationAmount {
  address: Address;
  amount: string;
  token: {
    address: Address;
    decimals: number;
    symbol: string;
  };
}

interface BurnedWBnb {
  address: Address;
  destinationAmounts: DestinationAmount[];
  id: string;
}

type GetBurnedWBnbApiOutput = BurnedWBnb[];

export interface GetBurnedWBnbInput {
  publicClient: PublicClient;
}

export type GetBurnedWBnbOutput = {
  burnedWBnbMantissa: bigint;
};

export const getBurnedWBnb = async ({
  publicClient: _publicClient,
}: GetBurnedWBnbInput): Promise<GetBurnedWBnbOutput> => {
  const response = await restService<GetBurnedWBnbApiOutput>({
    endpoint: '/protocol-reserve/destination-amounts',
    method: 'GET',
    params: {
      converterAddress: WBNB_BURN_CONVERTER_CONTRACT_ADDRESS,
      destinationAddress: NULL_ADDRESS,
      chainId: ChainId.BSC_MAINNET, // WBNBs are only burned on BSC
    },
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const burnedWBnbMantissa = payload.reduce((acc, burnedBnb) => {
    let totalAmountMantissa = 0n;

    burnedBnb.destinationAmounts.forEach(({ amount }) => {
      totalAmountMantissa += BigInt(amount);
    });

    return acc + totalAmountMantissa;
  }, 0n);

  return {
    burnedWBnbMantissa,
  };
};
