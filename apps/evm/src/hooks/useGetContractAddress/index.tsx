import {
  type GetContractAddressInput,
  type GetUniqueContractAddressInput,
  type GetUniquePerPoolContractAddressInput,
  getContractAddress,
} from 'libs/contracts';
import { useChainId } from 'libs/wallet';

export type UseGetContractAddressInput =
  | Omit<GetUniqueContractAddressInput, 'chainId'>
  | Omit<GetUniquePerPoolContractAddressInput, 'chainId'>;

export const useGetContractAddress = (input: UseGetContractAddressInput) => {
  const { chainId } = useChainId();

  const formattedInput: GetContractAddressInput = {
    ...input,
    chainId,
  };

  const address = getContractAddress(formattedInput);
  return { address };
};
