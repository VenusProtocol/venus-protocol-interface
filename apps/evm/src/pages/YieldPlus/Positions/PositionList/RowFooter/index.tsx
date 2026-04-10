import { AccordionAnimatedContent, Card } from 'components';
import type { YieldPlusPosition } from 'types';
import { StatusTab } from './StatusTab';

export interface RowFooterProps {
  row: YieldPlusPosition;
  isOpen: boolean;
}

export const RowFooter: React.FC<RowFooterProps> = ({ row, isOpen }) => {
  return (
    <AccordionAnimatedContent className="flex flex-col gap-y-6 md:mb-4" isOpen={isOpen}>
      <Card className="flex flex-col gap-y-6 bg-dark-blue border-background-hover p-3 md:p-6">
        <StatusTab row={row} />
      </Card>
    </AccordionAnimatedContent>
  );
};
