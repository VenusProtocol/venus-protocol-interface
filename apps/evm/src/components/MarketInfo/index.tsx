import {
  LabeledInlineContent,
  type LabeledInlineContentProps,
  MarketCard,
  type MarketCardProps,
} from 'components';

export interface MarketInfoProps extends Omit<MarketCardProps, 'children'> {
  items: LabeledInlineContentProps[];
}

export const MarketInfo: React.FC<MarketInfoProps> = ({ items, ...otherProps }) => (
  <MarketCard {...otherProps}>
    <ul className="m-0 p-0">
      {items.map(({ label, children, ...otherItemProps }) => (
        <li
          className="list-none py-3 px-0 border-b border-lightGrey last-of-type:border-b-0 last-of-type:pb-0"
          key={`market-info-stat-${label}`}
        >
          <LabeledInlineContent label={label} {...otherItemProps}>
            <span className="font-semibold">{children}</span>
          </LabeledInlineContent>
        </li>
      ))}
    </ul>
  </MarketCard>
);
