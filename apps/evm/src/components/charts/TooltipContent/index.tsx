/** @jsxImportSource @emotion/react */
export interface TooltipItem {
  label: string;
  value: string | number;
}

export interface TooltipContentProps {
  items: TooltipItem[];
}

const TooltipContent: React.FC<TooltipContentProps> = ({ items }) => (
  <div className="space-y-1 sm:space-y-2 p-3 bg-background rounded-lg">
    {items.map(item => (
      <div className="flex items-center mr-auto" key={`tooltip-content-item-${item.label}`}>
        <span className="mr-2 text-grey text-xs">{item.label}</span>

        <span className="text-offWhite text-sm font-semibold">{item.value}</span>
      </div>
    ))}
  </div>
);

export default TooltipContent;
