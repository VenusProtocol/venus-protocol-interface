import type { Distribution } from '../../types';

export interface DistributionProps extends React.HTMLAttributes<HTMLDivElement>, Distribution {}

export const ListItem: React.FC<DistributionProps> = ({
  name,
  description,
  value,
  ...otherProps
}) => (
  <div {...otherProps}>
    <div className="flex justify-between items-center">
      <p>{name}</p>

      <p>{value}</p>
    </div>

    {!!description && <div className="text-grey text-sm">{description}</div>}
  </div>
);
