import { Card } from 'components';

import { RankSection } from '../RankSection';
import { RankTable } from '../RankTable';

export const RankingPanel: React.FC = () => (
  <Card
    variant="glass"
    className="flex h-full flex-col gap-2.5 p-3 2xl:row-span-2 2xl:grid 2xl:grid-cols-[minmax(0,1fr)] 2xl:grid-rows-subgrid"
  >
    <RankSection />

    <RankTable />
  </Card>
);
