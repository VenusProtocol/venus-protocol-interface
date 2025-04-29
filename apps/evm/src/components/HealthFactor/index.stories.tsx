import type { Meta } from '@storybook/react';

import { HEALTH_FACTOR_MAX_VALUE } from 'components/HealthFactor/formatHealthFactorToReadableValue';
import { HealthFactor, type HealthFactorProps } from '.';

export default {
  title: 'Components/HealthFactor',
  component: HealthFactor,
} as Meta<typeof HealthFactor>;

const Presentation: React.FC<Pick<HealthFactorProps, 'factor'>> = ({ factor }) => (
  <div className="space-y-4 flex flex-col items-start">
    <HealthFactor factor={factor} />
  </div>
);

export const Infinite = () => <Presentation factor={Number.POSITIVE_INFINITY} />;

export const AboveMax = () => <Presentation factor={HEALTH_FACTOR_MAX_VALUE + 1} />;

export const Safe = () => <Presentation factor={12.23123} />;

export const Moderate = () => <Presentation factor={1.3461} />;

export const Risky = () => <Presentation factor={1.12321} />;

export const Liquidation = () => <Presentation factor={0.8738529} />;
