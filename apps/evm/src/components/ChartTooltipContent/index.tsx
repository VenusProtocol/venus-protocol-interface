export interface ChartTooltipContentItem {
  label: string;
  value: string | number;
}

export interface ChartTooltipContentProps {
  items: ChartTooltipContentItem[];
}

export const ChartTooltipContent: React.FC<ChartTooltipContentProps> = ({ items }) => (
  <div className="space-y-1 sm:space-y-2 rounded-lg border border-raised bg-menu p-3 shadow-menu backdrop-blur-raised backdrop-saturate-[1.2]">
    {items.map(item => (
      <div className="flex items-center mr-auto" key={`tooltip-content-item-${item.label}`}>
        <span className="mr-2 text-secondary text-xs">{item.label}</span>

        <span className="text-primary text-sm font-semibold">{item.value}</span>
      </div>
    ))}
  </div>
);
