import type { Distribution } from '../types';
import { ListItem } from './ListItem';

export interface DistributionGroupProps {
  title?: string;
  distributions: Distribution[];
}

export const DistributionGroup: React.FC<DistributionGroupProps> = ({ title, distributions }) => (
  <div>
    {title && <p className="uppercase mb-2 font-semibold">{title}</p>}

    <div className="space-y-2">
      {distributions.map(i => (
        <ListItem {...i} key={`${i.name}-${i.token.address}`} />
      ))}
    </div>
  </div>
);
