import { queryClient } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_ADAPTER_PARAMS, LAYER_ZERO_CHAIN_IDS } from 'constants/layerZero';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { xVSProxyOFTSrcAbi } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { pad } from 'viem';

export type BridgeXvsInput = {
  accountAddress: string;
  destinationChainId: ChainId;
  amountMantissa: BigNumber;
  nativeCurrencyFeeMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<BridgeXvsInput>;

export const useBridgeXvs = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const { address: tokenBridgeContractSrcAddress } = useGetContractAddress({
    name: 'XVSProxyOFTSrc',
  });
  const { address: tokenBridgeContractDestAddress } = useGetContractAddress({
    name: 'XVSProxyOFTDest',
  });

  const tokenBridgeContractAddress =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? tokenBridgeContractSrcAddress
      : tokenBridgeContractDestAddress;

  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    fn: ({ nativeCurrencyFeeMantissa, destinationChainId, amountMantissa }: BridgeXvsInput) =>
      callOrThrow(
        { tokenBridgeContractAddress, accountAddress },
        params => {
          const layerZeroDestChainId = LAYER_ZERO_CHAIN_IDS[destinationChainId];

          return {
            abi: xVSProxyOFTSrcAbi,
            address: params.tokenBridgeContractAddress,
            functionName: 'sendFrom',
            args: [
              params.accountAddress,
              layerZeroDestChainId,
              pad(params.accountAddress),
              BigInt(amountMantissa.toFixed()),
              {
                adapterParams: DEFAULT_ADAPTER_PARAMS,
                refundAddress: params.accountAddress,
                zroPaymentAddress: NULL_ADDRESS,
              },
            ],
            value: BigInt(nativeCurrencyFeeMantissa.toFixed()),
          };
        },
        'somethingWentWrong',
      ),
    transactionType: 'layerZero',
    onConfirmed: async ({ input: accountAddress }) => {
      if (xvs) {
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              chainId,
              tokenAddress: xvs.address,
              accountAddress,
            },
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_TOKEN_BALANCES,
            {
              chainId,
              accountAddress,
            },
          ],
        });
      }
    },
    options,
  });
};

export default useBridgeXvs;
