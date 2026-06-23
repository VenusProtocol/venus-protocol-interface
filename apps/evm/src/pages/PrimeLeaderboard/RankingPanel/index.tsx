import { Card } from 'components';

import { RankSection } from '../RankSection';
import { RankTable } from '../RankTable';

export const RankingPanel: React.FC = () => (
  <Card className="flex h-full flex-col gap-2.5 border-dark-grey bg-background p-3">
    <RankSection />

    <RankTable />
  </Card>
);
