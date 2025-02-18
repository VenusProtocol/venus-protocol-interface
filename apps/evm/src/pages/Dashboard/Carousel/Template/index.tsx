import { Card } from 'components';
import { cn } from 'utilities';

export interface TemplateProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Template: React.FC<TemplateProps> = ({ className, ...props }) => (
  <Card
    className={cn(
      'flex border-lightGrey relative overflow-hidden border py-6 h-100 sm:h-50 sm:p-0 md:p-0',
      className,
    )}
    {...props}
  />
);
