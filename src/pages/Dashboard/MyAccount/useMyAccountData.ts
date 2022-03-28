import { useWalletBalance } from '../../../hooks/useWalletBalance';
import { useBorrowLimit } from '../../../hooks/useBorrowLimit';

export const useMyAccountData = () => {
  const { totalSupply, netAPY, withXVS, setWithXVS, totalBorrow } = useWalletBalance();
  const { available, borrowPercent } = useBorrowLimit();

  return { totalSupply, netAPY, withXVS, setWithXVS, totalBorrow, available, borrowPercent };
};
