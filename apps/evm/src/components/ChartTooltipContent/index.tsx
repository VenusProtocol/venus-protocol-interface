export interface ChartTooltipContentItem {
  label: string;
  value: string | number;
}

export interface ChartTooltipContentProps {
  items: ChartTooltipContentItem[];
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ items }) => (
  <div className="space-y-1 sm:space-y-2 p-3 bg-background rounded-lg">
    {items.map(item => (
      <div className="flex items-center mr-auto" key={`tooltip-content-item-${item.label}`}>
        <span className="mr-2 text-grey text-xs">{item.label}</span>

        <span className="text-white text-sm font-semibold">{item.value}</span>
      </div>
    ))}
  </div>
);
