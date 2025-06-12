import { greaterThanOrEqualTo, runtimeERC20BalanceOf } from '@biconomy/abstractjs';
import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { aaveV3PoolAbi, vBep20Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId, useMeeClient } from 'libs/wallet';
import type { ImportableSupplyPosition, VToken } from 'types';

type ImportSupplyPositionInput = {
  position: ImportableSupplyPosition;
  vToken: VToken;
};

type Options = UseSendTransactionOptions<ImportSupplyPositionInput>;

export const useImportSupplyPosition = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  const { data: getMeeClientData } = useMeeClient();
  const nexusAccount = getMeeClientData?.nexusAccount;
  const meeClient = getMeeClientData?.meeClient;

  const { address: aaveV3PoolContractAddress } = useGetContractAddress({
    name: 'AaveV3Pool',
  });

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

      console.log(position, aaveV3PoolContractAddress);

      if (position.protocol === 'aave') {
        // TODO: use values from passdd position
        const aTokenAmountMantissa = 300000000000000000n; // 0.3 aUSDT
        const underlyingTokenAmountMantissa = 100000000000000000n; // 0.1 USDT

        const nexusAccountAddress = nexusAccount.addressOn(chainId)!;

        const instructions = await Promise.all([
          // Withdraw Aave position and transfer tokens to companion account
          nexusAccount.buildComposable({
            type: 'default',
            data: {
              to: aaveV3PoolContractAddress!,
              abi: aaveV3PoolAbi,
              functionName: 'withdraw',
              args: [position.tokenAddress, underlyingTokenAmountMantissa, nexusAccountAddress],
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
          // Mint tokens from vToken with companion account
          nexusAccount.buildComposable({
            type: 'default',
            data: {
              to: vToken.address,
              abi: vBep20Abi,
              functionName: 'mint',
              args: [
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
          // Transfer vTokens to EOA
          nexusAccount.buildComposable({
            type: 'transfer',
            data: {
              recipient: accountAddress,
              tokenAddress: vToken.address,
              amount: runtimeERC20BalanceOf({
                targetAddress: nexusAccountAddress,
                tokenAddress: vToken.address,
                constraints: [greaterThanOrEqualTo(100n)],
              }),
              chainId,
              gasLimit: 100000n,
            },
          }),
          // Transfer any leftover aTokens to EOA
          nexusAccount.buildComposable({
            type: 'transfer',
            data: {
              recipient: accountAddress,
              tokenAddress: position.aTokenAddress,
              amount: runtimeERC20BalanceOf({
                targetAddress: nexusAccountAddress,
                tokenAddress: position.aTokenAddress,
                constraints: [greaterThanOrEqualTo(100n)],
              }),
              chainId,
              gasLimit: 100000n,
            },
          }),
        ]);

        const fusionQuote = await meeClient.getFusionQuote({
          trigger: {
            chainId,
            tokenAddress: position.aTokenAddress,
            amount: aTokenAmountMantissa,
            gasLimit: 300000n,
          },
          instructions,
          sponsorship: true,
        });

        return fusionQuote;
      }

      // This cose should never be reached, but just in case we throw a generic internal error
      throw new VError({
        type: 'unexpected',
        code: 'somethingWentWrong',
      });
    },
    onConfirmed: ({ input }) => {
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
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
        queryKey: [FunctionKey.GET_POOLS],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.vToken.underlyingToken.address,
            accountAddress,
            spenderAddress: input.vToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_IMPORTABLE_SUPPLY_POSITIONS,
          {
            accountAddress,
            chainId,
          },
        ],
      });
    },
    options,
  });
};
