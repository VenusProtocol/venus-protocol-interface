import type { StepStatus } from '../StepIcon';

export const getStepStatus = (stepIndex: number, currentIndex: number): StepStatus => {
  if (stepIndex < currentIndex) return 'success';
  if (stepIndex === currentIndex) return 'on';
  return 'off';
};
