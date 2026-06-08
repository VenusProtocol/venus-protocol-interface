import { cn } from '@venusprotocol/ui';

import { Card } from 'components';

export interface EndOfCycleProps {
  className?: string;
}

export const EndOfCycle: React.FC<EndOfCycleProps> = ({ className }) => (
  <Card
    className={cn(
      'flex h-37 items-center justify-center bg-background text-p3s text-light-grey',
      className,
    )}
  >
    End of Cycle (countdown)
  </Card>
);
