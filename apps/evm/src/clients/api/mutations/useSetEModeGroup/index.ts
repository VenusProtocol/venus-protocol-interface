import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { legacyPoolComptrollerAbi } from 'libs/contracts';
import type { Address } from 'viem';

export type SetEModeGroupInput = {
  comptrollerContractAddress: Address;
  eModeGroupId: number;
  eModeGroupName?: string;
  userEModeGroupName?: string;
};
type Options = UseSendTransactionOptions<SetEModeGroupInput>;

export const useSetEModeGroup = (options?: Partial<Options>) => {
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: SetEModeGroupInput) => ({
      abi: legacyPoolComptrollerAbi, // Only the legacy Core Pool on BSC currently supports E-mode
      address: input.comptrollerContractAddress,
      functionName: 'enterPool',
      args: [BigInt(input.eModeGroupId)],
    }),
    onConfirmed: ({ input }) => {
      const { eModeGroupName, userEModeGroupName } = input;

      if (eModeGroupName) {
        captureAnalyticEvent('E-mode group enabled', {
          eModeGroupName,
        });
      }

      if (userEModeGroupName && !eModeGroupName) {
        captureAnalyticEvent('E-mode group disabled', {
          eModeGroupName: userEModeGroupName,
        });
      }

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options,
  });
};
