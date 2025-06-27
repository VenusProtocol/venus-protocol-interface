import { Button } from '@venusprotocol/ui';
import { VError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId, useMeeClient } from 'libs/wallet';

const OKX_DEX_API_URL = 'https://web3.okx.com/api/v5';

export const SwapButton: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { chainId } = useChainId();
  const { data: getMeeClientData } = useMeeClient();
  const nexusAccount = getMeeClientData?.nexusAccount;
  const meeClient = getMeeClientData?.meeClient;

  const usdc = useGetToken({
    symbol: 'USDC',
  });

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  if (!nexusAccount || !meeClient || !accountAddress || !usdc || !xvs) {
    return undefined;
  }

  const handleSwap = async () => {
    // Get quote

    const queryParams = {
      chainId,
      fromTokenAddress: xvs.address,
      toTokenAddress: usdc.address,
      swapMode: 'exactIn', // TODO: test exactOut
      amount: '1000000000000000000', // 0.1 token (18 decimals)
    } as unknown as Record<string, string>;

    const response = await fetch(
      `${OKX_DEX_API_URL}/dex/aggregator/quote?${new URLSearchParams(queryParams).toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      console.log('Error:', response);

      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    }

    const data = await response.json();

    console.log(data);
  };

  return <Button onClick={handleSwap}>Swap</Button>;
};
