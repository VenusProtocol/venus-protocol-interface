import { useGetToken } from 'packages/tokens';

import { Form } from './Form';
import { RewardDetails } from './RewardDetails';

const PrimeCalculator: React.FC = () => {
  const usdt = useGetToken({
    symbol: 'USDT',
  });

  if (!usdt) {
    return null;
  }

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
      <Form />

      {/* TODO: wire up RewardDetails */}
      <RewardDetails
        primeBorrowApy="-"
        primeSupplyApy="-"
        token={usdt}
        totalYearlyRewards="-"
        userYearlyRewards="-"
        userSuppliedTokens="-"
        userBorrowedTokens="-"
      />
    </div>
  );
};

export default PrimeCalculator;
