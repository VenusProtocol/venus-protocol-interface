import { Card } from 'components';

export interface PerformanceGraphProps {
  className?: string;
}

export const PerformanceGraph: React.FC<PerformanceGraphProps> = ({ className }) => (
  <Card className={className}>Performance graph will go here</Card>
);
