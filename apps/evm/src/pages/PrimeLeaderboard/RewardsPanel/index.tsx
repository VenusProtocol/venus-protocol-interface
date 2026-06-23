import { Card } from 'components';
import { useAccountAddress } from 'libs/wallet';

import { RewardTable } from '../RewardTable';
import { TotalRewardsSection } from '../TotalRewardsSection';
import { UserRewardsSection } from '../UserRewardsSection';

export const RewardsPanel: React.FC = () => {
  const { accountAddress } = useAccountAddress();

  return (
    <Card className="flex h-full flex-col gap-2.5 border-dark-grey bg-background p-3">
      {accountAddress ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <TotalRewardsSection />

          <UserRewardsSection />
        </div>
      ) : (
        <TotalRewardsSection />
      )}

      <RewardTable />
    </Card>
  );
};
