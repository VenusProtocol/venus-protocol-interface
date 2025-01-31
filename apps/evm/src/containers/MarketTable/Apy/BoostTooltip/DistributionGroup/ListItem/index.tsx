import { TokenIcon } from 'components';
import type { Distribution } from '../../types';

export interface DistributionProps extends React.HTMLAttributes<HTMLDivElement>, Distribution {}

export const ListItem: React.FC<DistributionProps> = ({
  name,
  description,
  value,
  token,
  ...otherProps
}) => (
  <div {...otherProps}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <TokenIcon token={token} className="w-4 h-4" />

        <p>{name}</p>
      </div>

      <p>{value}</p>
    </div>

    {!!description && <div className="text-grey text-sm">{description}</div>}
  </div>
);
