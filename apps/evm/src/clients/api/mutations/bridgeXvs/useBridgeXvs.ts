import { BridgeXvsInput, bridgeXvs, queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import {
  useGetXVSProxyOFTDestContract,
  useGetXVSProxyOFTSrcContract,
  useGetXvsVaultContract,
} from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedBridgeXvsInput = Omit<BridgeXvsInput, 'tokenBridgeContract'>;
type Options = UseSendTransactionOptions<TrimmedBridgeXvsInput>;

const useBridgeXvs = (options?: Options) => {
  const { chainId } = useChainId();
  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const xvsVaultContract = useGetXvsVaultContract({ chainId, passSigner: true });
  const tokenBridgeContractSrc = useGetXVSProxyOFTSrcContract({ chainId, passSigner: true });
  const tokenBridgeContractDest = useGetXVSProxyOFTDestContract({ chainId, passSigner: true });
  const tokenBridgeContract =
    chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
      ? tokenBridgeContractSrc
      : tokenBridgeContractDest;

  return useSendTransaction({
    fnKey: FunctionKey.BRIDGE_XVS,
    fn: (input: TrimmedBridgeXvsInput) =>
      callOrThrow({ tokenBridgeContract }, params =>
        bridgeXvs({
          ...params,
          ...input,
        }),
      ),
    transactionType: 'layerZero',
    onConfirmed: async ({ input: accountAddress }) => {
      if (xvs && xvsVaultContract) {
        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: xvs.address,
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
          },
        ]);
      }
    },
    options,
  });
};

export default useBridgeXvs;
