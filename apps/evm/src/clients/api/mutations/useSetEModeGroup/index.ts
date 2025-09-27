import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { legacyPoolComptrollerAbi } from 'libs/contracts';
import { isUserRejectedTxError } from 'libs/errors';
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
    fn: (input: SetEModeGroupInput) => {
      const { eModeGroupName, userEModeGroupName, comptrollerContractAddress, eModeGroupId } =
        input;

      if (!userEModeGroupName && eModeGroupName) {
        captureAnalyticEvent('enable_e_mode_initiated', {
          eModeGroupName,
        });
      } else if (userEModeGroupName && !eModeGroupName) {
        captureAnalyticEvent('disable_e_mode_initiated', {
          eModeGroupName: userEModeGroupName,
        });
      } else if (userEModeGroupName && eModeGroupName) {
        captureAnalyticEvent('switch_e_mode_initiated', {
          prevEModeGroupName: userEModeGroupName,
          eModeGroupName,
        });
      }

      return {
        abi: legacyPoolComptrollerAbi, // Only the legacy Core Pool on BSC currently supports E-mode
        address: comptrollerContractAddress,
        functionName: 'enterPool',
        args: [BigInt(eModeGroupId)],
      };
    },
    onSigned: ({ input }) => {
      const { eModeGroupName, userEModeGroupName } = input;

      if (!userEModeGroupName && eModeGroupName) {
        captureAnalyticEvent('enable_e_mode_signed', {
          eModeGroupName,
        });
      } else if (userEModeGroupName && !eModeGroupName) {
        captureAnalyticEvent('disable_e_mode_signed', {
          eModeGroupName: userEModeGroupName,
        });
      } else if (userEModeGroupName && eModeGroupName) {
        captureAnalyticEvent('switch_e_mode_signed', {
          prevEModeGroupName: userEModeGroupName,
          eModeGroupName,
        });
      }
    },
    onConfirmed: ({ input }) => {
      const { eModeGroupName, userEModeGroupName } = input;

      if (eModeGroupName) {
        captureAnalyticEvent('E-mode group enabled', {
          eModeGroupName,
        });
      } else if (userEModeGroupName && !eModeGroupName) {
        captureAnalyticEvent('E-mode group disabled', {
          eModeGroupName: userEModeGroupName,
        });
      }

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_POOLS],
      });
    },
    options: {
      ...options,
      onError: (error, input, context) => {
        const { userEModeGroupName, eModeGroupName } = input;

        const userRejectedTxError = isUserRejectedTxError({ error });

        if (userRejectedTxError && !userEModeGroupName && eModeGroupName) {
          captureAnalyticEvent('enable_e_mode_rejected', {
            eModeGroupName,
          });
        } else if (userRejectedTxError && userEModeGroupName && !eModeGroupName) {
          captureAnalyticEvent('disable_e_mode_rejected', {
            eModeGroupName: userEModeGroupName,
          });
        } else if (userRejectedTxError && userEModeGroupName && eModeGroupName) {
          captureAnalyticEvent('switch_e_mode_rejected', {
            prevEModeGroupName: userEModeGroupName,
            eModeGroupName,
          });
        }

        if (options?.onError) {
          options?.onError(error, input, context);
        }
      },
    },
  });
};
