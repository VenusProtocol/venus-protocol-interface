import {
  type GetSupertransactionReceiptPayloadWithReceipts,
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';
import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import MAX_UINT256 from 'constants/maxUint256';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { aaveV3PoolAbi, vBep20Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId, useMeeClient } from 'libs/wallet';
import type { ImportableSupplyPosition, VToken } from 'types';
import { buffer } from 'utilities';

type ImportSupplyPositionInput = {
  position: ImportableSupplyPosition;
  vToken: VToken;
};

type Options = UseSendTransactionOptions<ImportSupplyPositionInput> & {
  onConfirmed?: (input: {
    transactionHash: string;
    transactionReceipt: GetSupertransactionReceiptPayloadWithReceipts;
    input: ImportSupplyPositionInput;
  }) => Promise<unknown> | unknown;
};

export const useImportSupplyPosition = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  const { data: getMeeClientData } = useMeeClient();
  const nexusAccount = getMeeClientData?.nexusAccount;
  const meeClient = getMeeClientData?.meeClient;

  const { address: aaveV3PoolContractAddress } = useGetContractAddress({
    name: 'AaveV3Pool',
  });

  const { onConfirmed, ...otherOptions } = options || {};

  return useSendTransaction({
    transactionType: 'biconomy',
    fn: async ({ position, vToken }: ImportSupplyPositionInput) => {
      if (
        !meeClient ||
        !nexusAccount ||
        !nexusAccount.addressOn(chainId) ||
        !accountAddress ||
        (position.protocol === 'aave' && !aaveV3PoolContractAddress)
      ) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (position.protocol === 'aave') {
        const nexusAccountAddress = nexusAccount.addressOn(chainId)!;

        const instructions = await Promise.all([
          // Transfer any aTokens received as accrued interests to SCA
          nexusAccount.buildComposable({
            type: 'transferFrom',
            data: {
              recipient: nexusAccountAddress,
              sender: accountAddress,
              tokenAddress: position.aTokenAddress,
              amount: runtimeERC20BalanceOf({
                targetAddress: accountAddress,
                tokenAddress: position.aTokenAddress,
                constraints: [greaterThanOrEqualTo(100n)],
              }),
              chainId,
              gasLimit: 100000n,
            },
          }),
          // Withdraw Aave position and transfer tokens to companion account
          nexusAccount.buildComposable({
            type: 'default',
            data: {
              to: aaveV3PoolContractAddress!,
              abi: aaveV3PoolAbi,
              functionName: 'withdraw',
              args: [
                position.tokenAddress,
                MAX_UINT256.toFixed(), // Withdraw entire supply
                nexusAccountAddress,
              ],
              chainId,
              gasLimit: 100000n,
            },
          }),
          // Give approval to Venus pool to spend tokens
          nexusAccount.buildComposable({
            type: 'approve',
            data: {
              tokenAddress: position.tokenAddress,
              spender: vToken.address,
              amount: runtimeERC20BalanceOf({
                targetAddress: nexusAccountAddress,
                tokenAddress: position.tokenAddress,
                constraints: [greaterThanOrEqualTo(100n)],
              }),
              chainId,
              gasLimit: 100000n,
            },
          }),
          // Mint tokens from vToken with companion account, on behalf of EOA
          nexusAccount.buildComposable({
            type: 'default',
            data: {
              to: vToken.address,
              abi: vBep20Abi,
              functionName: 'mintBehalf',
              args: [
                accountAddress,
                runtimeERC20BalanceOf({
                  targetAddress: nexusAccountAddress,
                  tokenAddress: position.tokenAddress,
                  constraints: [greaterThanOrEqualTo(100n)],
                }),
              ],
              chainId,
              gasLimit: 100000n,
            },
          }),
        ]);

        // Buffer approval amount to account for accrued interests while transaction is processing.
        // We will transfer these accrued interests to the SCA in the first instruction of the super
        // transaction
        const approvalAmount = buffer({
          amountMantissa: position.userATokenBalanceWithInterestsMantissa,
        });

        const fusionQuote = await meeClient.getFusionQuote({
          trigger: {
            chainId,
            tokenAddress: position.aTokenAddress,
            amount: position.userATokenBalanceMantissa,
            approvalAmount,
            gasLimit: 500000n,
          },
          instructions,
          sponsorship: true,
        });

        return fusionQuote;
      }

      // This case should never be reached, but just in case we throw a generic internal error
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    },
    onConfirmed: ({ input, transactionHash, transactionReceipt }) => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            chainId,
            accountAddress,
            vTokenAddress: input.vToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_IMPORTABLE_POSITIONS,
          {
            accountAddress,
            chainId,
          },
        ],
      });

      onConfirmed?.({
        input,
        transactionHash,
        transactionReceipt: transactionReceipt as GetSupertransactionReceiptPayloadWithReceipts,
      });
    },
    options: otherOptions,
  });
};
