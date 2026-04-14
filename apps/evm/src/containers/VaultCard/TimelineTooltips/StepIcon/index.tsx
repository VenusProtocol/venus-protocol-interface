import { Icon } from 'components';

export type StepStatus = 'success' | 'on' | 'off';

export const StepIcon: React.FC<{ status: StepStatus }> = ({ status }) => {
  if (status === 'success') {
    return <Icon name="checkInline" className="text-green size-5" />;
  }

  if (status === 'on') {
    return <Icon name="radioInline" className="text-blue size-5" />;
  }

  return <Icon name="radio" className="text-grey size-5" />;
};
