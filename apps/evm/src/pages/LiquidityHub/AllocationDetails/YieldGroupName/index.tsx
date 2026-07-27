import { cn } from '@venusprotocol/ui';

export interface YieldGroupNameProps {
  name: string;
  bgClassName: string;
}

export const YieldGroupName: React.FC<YieldGroupNameProps> = ({ name, bgClassName }) => (
  <div className="flex items-center gap-x-2 h-full w-full">
    <div className={cn('size-2 rounded-full', bgClassName)} />

    <span>{name}</span>
  </div>
);
